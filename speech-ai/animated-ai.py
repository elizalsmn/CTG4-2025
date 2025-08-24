import asyncio
import json
import base64
import websockets
from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
import assemblyai as aai
import fastapi_poe as fp
from assemblyai.streaming.v3 import (
    BeginEvent,
    StreamingClient,
    StreamingClientOptions,
    StreamingError,
    StreamingEvents,
    StreamingParameters,
    TurnEvent,
    TerminationEvent,
)

app = FastAPI()

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # React dev server
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class AI_assistant:
    def __init__(self):
        self.api_key = "API_KEY"
        self.poe_api_key = "POE_API_KEY"
        self.poe_bot_name = "gpt-4.1"
        
        self.streaming_client = None
        self.websocket = None
        self.is_connected = False
        self.full_transcript = [
            fp.ProtocolMessage(role="system", content="You are a speech learning assistant for children. Be playful and engaging. Ask us to spell words and speech learning only, don't do any other materials. Don't let the child end, keep engaging them until the time is up. Don't do any asterisks or anything, just pretend like we are on a conversation.")
        ]
        
    def set_websocket(self, websocket):
        self.websocket = websocket
        
    async def start_transcription(self):        
        try:
            self.streaming_client = StreamingClient(
                StreamingClientOptions(
                    api_key=self.api_key,
                    api_host="streaming.assemblyai.com",
                )
            )
            
            self.streaming_client.on(StreamingEvents.Begin, self.on_begin)
            self.streaming_client.on(StreamingEvents.Turn, self.on_turn)
            self.streaming_client.on(StreamingEvents.Termination, self.on_terminated)
            self.streaming_client.on(StreamingEvents.Error, self.on_error)
            
            # Connect to streaming service
            self.streaming_client.connect(
                StreamingParameters(
                    sample_rate=16000,
                    format_turns=True,
                )
            )
            self.is_connected = True
            print("✓ Connected to AssemblyAI streaming")
            
        except Exception as e:
            print(f"Error starting transcription: {e}")
            import traceback
            traceback.print_exc()
        
    async def process_audio_chunk(self, audio_data):
        print("Processing audio chunk...")
        if self.streaming_client and self.is_connected:
            try:
                # Convert base64 audio to bytes
                audio_bytes = base64.b64decode(audio_data)
                
                # Use the correct method: stream()
                self.streaming_client.stream(audio_bytes)
                
            except Exception as e:
                print(f"Error processing audio chunk: {e}")
                import traceback
                traceback.print_exc()
                
    async def stop_transcription(self):
        print("Stopping transcription...")
        if self.streaming_client and self.is_connected:
            try:
                self.streaming_client.disconnect(terminate=True)
                self.is_connected = False
                print("✓ Disconnected from AssemblyAI")
            except Exception as e:
                print(f"Error stopping transcription: {e}")
            self.streaming_client = None
            
    def on_begin(self, client, event: BeginEvent):
        print("✓ Transcription session began")
        return
        
    def on_turn(self, client, event: TurnEvent):
        if event.end_of_turn and event.transcript.strip():
            print(f"📝 Transcript received: {event.transcript}")
            asyncio.create_task(self.generate_ai_response(event.transcript))
            
    def on_terminated(self, client, event: TerminationEvent):
        print("📋 Transcription session terminated")
        self.is_connected = False
        return
        
    def on_error(self, client, error: StreamingError):
        print(f"❌ Streaming error: {error}")
        self.is_connected = False
        return
        
    async def generate_ai_response(self, transcript_text):
        print(f"\n👶 Child said: {transcript_text}")
        
        # Send transcript to frontend
        if self.websocket:
            try:
                await self.websocket.send_text(json.dumps({
                    "type": "transcript",
                    "text": transcript_text
                }))
            except Exception as e:
                print(f"Error sending transcript: {e}")
        
        try:
            self.full_transcript.append(
                fp.ProtocolMessage(role="user", content=transcript_text)
            )
            
            ai_response = ""
            for partial in fp.get_bot_response_sync(
                messages=self.full_transcript,
                bot_name=self.poe_bot_name,
                api_key=self.poe_api_key
            ):
                if hasattr(partial, 'text') and partial.text:
                    ai_response += partial.text
                elif hasattr(partial, 'content') and partial.content:
                    ai_response += partial.content
            
            if not ai_response.strip():
                ai_response = "I didn't catch that. Can you tell me about your favorite animal?"
            else: 
                print(f"Full AI response: {ai_response}")
                
            self.full_transcript.append(
                fp.ProtocolMessage(role="bot", content=ai_response)
            )
            
            # Send only text response (no audio generation)
            await self.send_text_response(ai_response)
            
        except Exception as e:
            print(f"❌ Error generating AI response: {e}")
            import traceback
            traceback.print_exc()
            
            ai_response = "Sorry, I didn't catch that. Can you try again?"
            await self.send_text_response(ai_response)

    async def send_text_response(self, text):
        """Send only the text response to frontend (no audio)"""
        print(f"🤖 AI Teacher: {text}\n")
        
        # Send AI response text to frontend
        if self.websocket:
            try:
                await self.websocket.send_text(json.dumps({
                    "type": "ai_response",
                    "text": text
                }))
                print("✓ Text response sent to frontend")
            except Exception as e:
                print(f"Error sending text response: {e}")

# Global assistant instance
ai_assistant = AI_assistant()

@app.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    await websocket.accept()
    print("INFO:     connection open")
    
    ai_assistant.set_websocket(websocket)
    
    # Send initial greeting (text only)
    greeting = "Hi, let's learn together! Today we are going to learn about animals. What is your favorite animal?"
    await ai_assistant.send_text_response(greeting)
    
    # Start transcription
    await ai_assistant.start_transcription()
    
    try:
        while True:
            data = await websocket.receive_text()
            message = json.loads(data)
            
            if message["type"] == "audio_chunk":
                await ai_assistant.process_audio_chunk(message["data"])
            elif message["type"] == "stop":
                await ai_assistant.stop_transcription()
                break
                
    except WebSocketDisconnect:
        print("Client disconnected")
    except Exception as e:
        print(f"WebSocket error: {e}")
    finally:
        await ai_assistant.stop_transcription()

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)