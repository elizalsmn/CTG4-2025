import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

// Inline resources for now. Later you can move to /public/locales/{lng}/{ns}.json
const resources = {
  en: {
    translation: {
      welcome_line1: 'Welcome',
      welcome_line2: 'Back!',
      login: 'Login',
      add_friend: 'Add Friend',
      opening: 'Opening...',
      close: 'Close',
      signup_prompt: "Don't have an account?",
  signup_cta: 'Sign Up',
  profile_header: "Shannon's Parent",
  child_name_label: "Child's Name",
  child_name_placeholder: "Enter child's name",
  child_name_required: "Child's name is required.",
  parent_name_label: "Parent's Name",
  parent_name_placeholder: "Enter parent's name (optional)",
  phone_label: 'Phone number',
  phone_placeholder: 'Enter phone number (optional)',
  language_label: 'Language',
  save: 'Save',
  lessons_library_title: 'Lesson Library'
  ,lesson_prefix: 'Lesson'
  ,writing_a: 'Writing A'
  ,type_video: 'Video',
  type_speaking: 'Speaking',
  type_writing: 'Writing'
  ,type_photo: 'Photo'
  ,school_leaderboard: 'Leaderboard'
  ,redeem_points: 'Redeem your Points'
  ,points_suffix: '{{count}} pts'
  ,welcome_back_learn: "Welcome back, let's learn!"
  ,attendance: 'Attendance'
  ,submissions: 'Submissions'
  ,performance_summary: 'Performance Summary',
  due_soon: 'Due Soon'
  ,latest_submission: 'Latest Submission'
  ,classes_attended: 'Classes attended: {{done}}/{{total}}'
  ,assignments_submitted: 'Assignments submitted: {{done}}/{{total}}'
  ,ai_placeholder: 'place holder for AI analytics :D'
  ,menu_home: 'Home'
  ,menu_assignments: 'Assignments'
  ,menu_leaderboard: 'Leaderboard'
  ,menu_voucher: 'Voucher'
  ,menu_communicate: 'Communicate'
  ,asg_details: 'Assignment Details'
  ,asg_grade: 'Grade'
  ,asg_due: 'Due'
  ,asg_submission_type: 'Submission Type',
  asg_description: 'Description'
  ,asg_attachments: 'Attachments'
  ,asg_cancel: 'Cancel'
  ,asg_upload: 'Upload'
  ,asg_start_video: 'Start Video'
  ,asg_pdf: 'PDF'
  ,asg_instruction_file: 'Instruction File'
  ,asg_lesson1_writingA: 'Lesson 1: Writing Syllabus A'
  ,asg_lesson1_speechB: 'Lesson 1: Speech Syllabus B'
  ,asg_video_upload: 'Voice Recording'
  ,asg_photo_video_upload: 'Photo Upload'
  ,tv_assignment_details: 'Assignment Details'
  ,tv_lesson1_speechB: 'Lesson 1: Speech Syllabus B'
  ,tv_camera_check: 'Turn on your camera and microphone!'
  ,tv_video_recording: 'Video Recording'
  ,tv_seconds_suffix: 'sec'
  ,tv_cancel: 'Cancel'
  ,tv_start: 'Start'
  ,tv_upload_success: 'Video uploaded successfully'
  ,tv_upload_fail: 'Upload failed'
  ,s2_enter_full_name: 'Enter Full Name'
  ,s2_full_name_placeholder: 'Full Name'
  ,s2_login: 'Login'
  ,sl_assignment_details: 'Assignment Details'
  ,sl_lesson1_speechB: 'Lesson 1: Speech Syllabus B',
  sl_welcome_intro: "Welcome! Are you ready to jump in and practice some new words? Just hit Start, and let’s see how awesome you can be!",
  sl_welcome_block: 'Welcome word wanderers! Are you ready to start practicing your words? Click Start and let the adventure begin! 🎉'
  ,sl_you_said: 'You said:'
  ,sl_start: 'Start'
  ,sl_next: 'Next'
  ,sl_finish: 'Finish'
  ,sl_cancel: 'Cancel'
  ,sl_good_job: 'Good job! You pronounced the word correctly.'
  ,sl_try_again: 'Please try again. Make sure to say it correctly!'
  ,sl_congrats_done: 'Congratulations! You finished all the words.'
  ,sl_audio_upload_success: 'Audio uploaded successfully'
  ,sl_upload_fail: 'Upload failed'
  ,sl_no_speech: 'No speech detected. Please try again.'
  ,sl_transcription_failed: 'Transcription failed. Please try again.'
  ,rc_available_coupons: 'Available Coupons'
  ,rc_available_to_redeem: 'Available to Redeem: {{count}}'
  ,rc_points_you_have: 'You have {{points}} Points'
  ,rc_my_coupons: 'My Coupons'
  ,rc_available_to_use: 'Available to Use: {{count}}'
  ,coupon_redeem_for: 'Redeem for'
  ,coupon_points_suffix: '{{points}} points'
  ,coupon_use: 'Use'
  ,coupon_exp: 'Exp:'
  ,coupon_redeem_btn: 'Redeem Now'
  ,coupon_valid_until: 'Valid until {{date}}'
  ,coupon_qr_placeholder: '[QR]'
  ,hp_student_name: 'Shannon Sie 👧🏻'
  ,hp_grade_level: 'Pre Kindergarten (K2)'
  ,hp_writing_materials_desc: 'Writing materials for group A, age xx to xx'
  ,hp_lesson1_title: 'Lesson 1: Writing Syllabus A'
  ,hp_lesson2_title: 'Lesson 2: Writing Syllabus A'
  ,hp_type_video: 'Video'
  ,hp_type_photo: 'Photo'
    }
  },
  zh: {
    translation: {
      welcome_line1: '欢迎',
      welcome_line2: '回来！',
      login: '登录',
      add_friend: '添加好友',
      opening: '正在打开…',
      close: '关闭',
      signup_prompt: '还没有账号？',
  signup_cta: '注册',
  profile_header: 'Shannon的家长',
  child_name_label: '孩子姓名',
  child_name_placeholder: '输入孩子姓名',
  child_name_required: '孩子姓名是必填项。',
  parent_name_label: '家长姓名',
  parent_name_placeholder: '输入家长姓名（可选）',
  phone_label: '电话号码',
  phone_placeholder: '输入电话号码（可选）',
  language_label: '语言',
  save: '保存'
  ,lessons_library_title: '课程库'
  ,lesson_prefix: '第'
  ,writing_a: '写作 A'
  ,type_video: '视频'
  ,type_photo: '照片'
  ,school_leaderboard: '学校排行榜'
  ,redeem_points: '兑换积分'
  ,points_suffix: '{{count}} 分'
  ,welcome_back_learn: '欢迎回来，一起学习！'
  ,attendance: '出勤率'
  ,submissions: '提交情况'
  ,performance_summary: '表现概览'
  ,latest_submission: '最新提交'
  ,classes_attended: '已上课程: {{done}}/{{total}}'
  ,assignments_submitted: '已提交作业: {{done}}/{{total}}'
  ,ai_placeholder: 'AI 分析占位符 :D'
  ,menu_home: '首页'
  ,menu_assignments: '作业'
  ,menu_leaderboard: '排行榜'
  ,menu_voucher: '优惠券'
  ,menu_communicate: '交流'
  ,asg_details: '作业详情'
  ,asg_grade: '成绩'
  ,asg_due: '截止'
  ,asg_submission_type: '提交类型'
  ,asg_attachments: '附件'
  ,asg_cancel: '取消'
  ,asg_upload: '上传'
  ,asg_start_video: '开始视频'
  ,asg_pdf: 'PDF'
  ,asg_instruction_file: '说明文件'
  ,asg_lesson1_writingA: '第1课：写作大纲 A'
  ,asg_lesson1_speechB: '第1课：演讲大纲 B'
  ,asg_video_upload: '视频上传'
  ,asg_photo_video_upload: '照片/视频上传'
  ,tv_assignment_details: '作业详情'
  ,tv_lesson1_speechB: '第1课：演讲大纲 B'
  ,tv_camera_check: '打开你的摄像头和麦克风！'
  ,tv_video_recording: '视频录制'
  ,tv_seconds_suffix: '秒'
  ,tv_cancel: '取消'
  ,tv_start: '开始'
  ,tv_upload_success: '视频上传成功'
  ,tv_upload_fail: '上传失败'
  ,s2_enter_full_name: '输入全名'
  ,s2_full_name_placeholder: '全名'
  ,s2_login: '登录'
  ,sl_assignment_details: '作业详情'
  ,sl_lesson1_speechB: '第1课：演讲大纲 B'
  ,sl_welcome_intro: '欢迎！点击开始来练习单词。'
  ,sl_welcome_block: '欢迎，词语探索者！\n准备好开始练习你的单词了吗？点击开始，让冒险启程！🎉'
  ,sl_you_said: '你说：'
  ,sl_start: '开始'
  ,sl_next: '下一步'
  ,sl_finish: '完成'
  ,sl_cancel: '取消'
  ,sl_good_job: '做得好！你正确地读出了这个单词。'
  ,sl_try_again: '请再试一次，确保正确发音！'
  ,sl_congrats_done: '恭喜！你完成了所有单词。'
  ,sl_audio_upload_success: '音频上传成功'
  ,sl_upload_fail: '上传失败'
  ,sl_no_speech: '未检测到语音，请再试一次。'
  ,sl_transcription_failed: '转录失败，请再试一次。'
  ,rc_available_coupons: '可兑换优惠券'
  ,rc_available_to_redeem: '可兑换数量：{{count}}'
  ,rc_points_you_have: '你有 {{points}} 积分'
  ,rc_my_coupons: '我的优惠券'
  ,rc_available_to_use: '可使用数量：{{count}}'
  ,coupon_redeem_for: '兑换'
  ,coupon_points_suffix: '{{points}} 分'
  ,coupon_use: '使用'
  ,coupon_exp: '有效期:'
  ,coupon_redeem_btn: '兑换'
  ,coupon_valid_until: '有效期至 {{date}}'
  ,coupon_qr_placeholder: '[二维码]'
    ,signup_cta: '注册',
    profile_header: 'Arthur的家长',
    child_name_label: '孩子姓名',
    child_name_placeholder: '输入孩子姓名',
    child_name_required: '孩子姓名是必填项。',
    parent_name_label: '家长姓名',
    parent_name_placeholder: '输入家长姓名（可选）',
    phone_label: '电话号码',
    phone_placeholder: '输入电话号码（可选）',
    language_label: '语言',
    save: '保存'
    ,lessons_library_title: '课程库'
    ,lesson_prefix: '第'
    ,writing_a: '写作 A'
    ,type_video: '视频'
    ,type_photo: '照片'
    ,school_leaderboard: '学校排行榜'
    ,redeem_points: '兑换积分'
    ,points_suffix: '{{count}} 分'
    ,welcome_back_learn: '欢迎回来，一起学习！'
    ,attendance: '出勤率'
    ,submissions: '提交情况'
    ,performance_summary: '表现概览'
    ,latest_submission: '最新提交'
    ,classes_attended: '已上课程: {{done}}/{{total}}'
    ,assignments_submitted: '已提交作业: {{done}}/{{total}}'
    ,ai_placeholder: 'AI 分析占位符 :D'
    ,menu_home: '首页'
    ,menu_assignments: '作业'
    ,menu_leaderboard: '排行榜'
    ,menu_voucher: '优惠券'
    ,menu_communicate: '交流'
    ,asg_details: '作业详情'
    ,asg_grade: '成绩'
    ,asg_due: '截止'
    ,asg_submission_type: '提交类型'
    ,asg_attachments: '附件'
    ,asg_cancel: '取消'
    ,asg_upload: '上传'
    ,asg_start_video: '开始视频'
    ,asg_pdf: 'PDF'
    ,asg_instruction_file: '说明文件'
    ,asg_lesson1_writingA: '第1课：写作大纲 A'
    ,asg_lesson1_speechB: '第1课：演讲大纲 B'
    ,asg_video_upload: '视频上传'
    ,asg_photo_video_upload: '照片/视频上传'
    ,tv_assignment_details: '作业详情'
    ,tv_lesson1_speechB: '第1课：演讲大纲 B'
    ,tv_camera_check: '打开你的摄像头和麦克风！'
    ,tv_video_recording: '视频录制'
    ,tv_seconds_suffix: '秒'
    ,tv_cancel: '取消'
    ,tv_start: '开始'
    ,tv_upload_success: '视频上传成功'
    ,tv_upload_fail: '上传失败'
    ,s2_enter_full_name: '输入全名'
    ,s2_full_name_placeholder: '全名'
    ,s2_login: '登录'
    ,sl_assignment_details: '作业详情'
    ,sl_lesson1_speechB: '第1课：演讲大纲 B'
    ,sl_welcome_intro: '欢迎！点击开始来练习单词。'
    ,sl_welcome_block: '欢迎，词语探索者！\n准备好开始练习你的单词了吗？点击开始，让冒险启程！🎉'
    ,sl_you_said: '你说：'
    ,sl_start: '开始'
    ,sl_next: '下一步'
    ,sl_finish: '完成'
    ,sl_cancel: '取消'
    ,sl_good_job: '做得好！你正确地读出了这个单词。'
    ,sl_try_again: '请再试一次，确保正确发音！'
    ,sl_congrats_done: '恭喜！你完成了所有单词。'
    ,sl_audio_upload_success: '音频上传成功'
    ,sl_upload_fail: '上传失败'
    ,sl_no_speech: '未检测到语音，请再试一次。'
    ,sl_transcription_failed: '转录失败，请再试一次。'
    ,rc_available_coupons: '可兑换优惠券'
    ,rc_available_to_redeem: '可兑换数量：{{count}}'
    ,rc_points_you_have: '你有 {{points}} 积分'
    ,rc_my_coupons: '我的优惠券'
    ,rc_available_to_use: '可使用数量：{{count}}'
    ,coupon_redeem_for: '兑换'
    ,coupon_points_suffix: '{{points}} 分'
    ,coupon_use: '使用'
    ,coupon_exp: '有效期:'
    ,coupon_redeem_btn: '兑换'
    ,coupon_valid_until: '有效期至 {{date}}'
    ,coupon_qr_placeholder: '[二维码]'
    ,hp_student_name: 'Shannon Sie 👧🏻'
    ,hp_grade_level: '幼儿园中班 (K2)'
    ,hp_writing_materials_desc: '写作材料（A组，年龄 xx 至 xx）'
    ,hp_lesson1_title: '第1课：写作大纲 A'
    ,hp_lesson2_title: '第2课：写作大纲 A'
    ,hp_type_video: '视频'
    ,hp_type_photo: '照片'
    }
  }
};

const savedLang = typeof window !== 'undefined' ? (localStorage.getItem('lang') || 'en') : 'en';

if (!i18n.isInitialized) {
  i18n
    .use(initReactI18next)
    .init({
      resources,
      lng: savedLang,
      fallbackLng: 'en',
      interpolation: { escapeValue: false }
    });
}

// Helper to also persist language whenever changed
export function setAppLanguage(lng) {
  i18n.changeLanguage(lng);
  try { localStorage.setItem('lang', lng); } catch(e) { /* ignore */ }
}

export default i18n;
