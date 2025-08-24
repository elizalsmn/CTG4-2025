import assemblyai as aai
from elevenlabs import generate, stream
import fastapi_poe as fp
from assemblyai.streaming.v3 import (
    BeginEvent,
    StreamingClient,
    StreamingClientOptions,
    StreamingError,
    StreamingEvents,
    StreamingParameters,
    StreamingSessionParameters,
    TerminationEvent,
    TurnEvent,
)

class AI_assistant:
    def __init__(self):
        self.api_key = "API_KEY"
        self.poe_api_key = "POE_API_KEY"
        self.poe_bot_name = "gpt-4.1"
        self.elevenlabs_api_key = "ELEVEN_LABS_API_KEY"
        
        self.streaming_client = None
        self.full_transcript = [
            fp.ProtocolMessage(role="system", content="You are a speech learning assistant for children. Be playful and engaging. Ask us to spell words and speech learning only, don't do any other materials. Don't let the child end, keep engaging them until the time is up. Don't do any asterisks or anything, just pretend like we are on a conversation. DOn't do asterisks or any other dot, comma")
        ]
        
    def start_transcription(self):        
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
        
        self.streaming_client.connect(
            StreamingParameters(
                sample_rate=16000,
                format_turns=True,
            )
        )
        
        try:
            self.streaming_client.stream(
                aai.extras.MicrophoneStream(sample_rate=16000)
            )
        except Exception as e:
            print(f"Error starting stream: {e}")
            
    def stop_transcription(self):
        if self.streaming_client:
            try:
                self.streaming_client.disconnect(terminate=True)
            except Exception as e:
                print(f"Error stopping transcription: {e}")
            self.streaming_client = None
            
    def on_begin(self, client, event: BeginEvent):
        # print(f"✓ Session started: {event.id}")
        return
        
    def on_turn(self, client, event: TurnEvent):
        if event.end_of_turn and event.transcript.strip():
            self.generate_ai_response(event.transcript)
            
    def on_terminated(self, client, event: TerminationEvent):
        return
        
    def on_error(self, client, error: StreamingError):
        return
        
    def generate_ai_response(self, transcript_text):
        print(f"\n👶 Child said: {transcript_text}")
        
        self.stop_transcription()
        
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
                 
            self.full_transcript.append(
                fp.ProtocolMessage(role="bot", content=ai_response)
            )
            
            self.generate_audio(ai_response)
            
        except Exception as e:
            print(f"❌ Error generating AI response: {e}")
            import traceback
            traceback.print_exc()
            
            ai_response = "Sorry, I didn't catch that. Can you try again?"
            self.generate_audio(ai_response)
        
        # Restart transcription after a short delay
        import time
        time.sleep(1)
        self.start_transcription()

    def generate_audio(self, text):
        print(f"🤖 AI Teacher: {text}\n")
        try:
            audio_stream = generate(
                api_key=self.elevenlabs_api_key,
                text=text,
                voice="Rachel",
                stream=True
            )
            stream(audio_stream)
        except Exception as e:
            print(f"Error generating audio: {e}")

# CLEAN MAIN EXECUTION - Remove duplicates
if __name__ == "__main__":
    greeting = "Hi, let's learn together! Today we are going to learn about animals. What is your favorite animal?"
    ai_assistant = AI_assistant()
    ai_assistant.generate_audio(greeting)
    ai_assistant.start_transcription()

    try:
        import time
        print("\n" + "="*60)
        print("🎤 READY TO LISTEN - Speak clearly into your microphone!")
        print("   The AI is waiting for your response about animals!")
        print("   Press Ctrl+C to stop")
        print("="*60 + "\n")
        
        while True:
            time.sleep(1)
            
    except KeyboardInterrupt:
        print("\nStopping...")
        ai_assistant.stop_transcription()
