"use client";

import Link from "next/link";
import {
  useTheme,
  type Language,
} from "../context/theme-context";
import ThemeLanguageSelector from "../components/ThemeLanguageSelector";

const translations = {
  en: {
    navHow: "How it works",
    navExplain: "Explainable AI",
    navPlatform: "Platform",
    signIn: "Sign in →",
    badge: "AI-Assisted Diabetic Retinopathy Screening",
    title1: "Intelligent retinal",
    title2: "screening for",
    title3: "earlier action.",
    description:
      "RetinaScreen provides AI-assisted fundus image screening to help healthcare workers identify diabetic retinopathy patterns, understand AI findings and support timely specialist referral.",
    start: "Start Screening",
    workflow: "Explore Workflow",
    ai: "AI-assisted",
    explainable: "Explainable",
    offline: "Offline-ready",
    doctor: "Doctor validation",
    workflowLabel: "Workflow",
    workflowTitle1: "From retinal image",
    workflowTitle2: "to clinical review.",
    workflowText:
      "A streamlined screening workflow designed for primary healthcare environments, with AI assistance and specialist validation built into the process.",
    platform: "Explore platform →",
    register: "Register",
    registerText:
      "Create a patient record and begin a retinal screening session.",
    capture: "Capture",
    captureText:
      "Upload or capture a fundus image and verify its quality.",
    analyze: "Analyze",
    analyzeText:
      "AI models assess retinal patterns and generate visual explanations.",
    refer: "Refer",
    referText:
      "Risk information supports specialist referral and doctor review.",
    explainLabel: "Explainable AI",
    explainTitle1: "Don't just show",
    explainTitle2: "a result.",
    explainTitle3: "Show why.",
    explainText:
      "The screening workflow combines disease grading, lesion visualization and model explanations so healthcare professionals can understand what contributed to an AI-assisted assessment.",
    severity: "DR Severity",
    severityText: "Grade 0–4 screening assessment.",
    lesions: "Lesion Maps",
    lesionsText: "Visualize detected retinal patterns.",
    gradcam: "Grad-CAM",
    gradcamText: "Highlight regions influencing the model.",
    review: "Doctor Review",
    reviewText:
      "Final clinical decision remains with the doctor.",
    access: "Platform access",
    accessTitle1: "One platform.",
    accessTitle2: "Three workspaces.",
    accessText:
      "Each role gets the tools needed for its part of the screening workflow.",
    healthWorker: "Health Worker",
    healthWorkerText:
      "Register patients, perform retinal screenings, capture fundus images and manage referrals.",
    doctorRole: "Doctor",
    doctorText:
      "Review referred cases, inspect AI explanations, validate screening results and manage follow-ups.",
    admin: "Administrator",
    adminText:
      "Monitor healthcare workers, facilities, screenings, referrals and platform analytics.",
    hwLogin: "Health Worker Login",
    doctorLogin: "Doctor Login",
    adminLogin: "Admin Login",
    offlineLabel: "Offline-first",
    offlineTitle:
      "Screening shouldn't stop when connectivity does.",
    offlineText:
      "The platform is designed around local storage and an offline-first workflow, allowing screening work to continue and synchronize when connectivity becomes available.",
    footerText:
      "AI-assisted diabetic retinopathy screening platform",
    clinical:
      "AI-assisted screening support only. Clinical review is required.",
    quality: "Image quality",
    qualityChecked: "Quality checked",
    model: "Model",
    vision: "Vision AI",
    analysis: "AI analysis",
    visualEvidence: "Visual evidence",
    attention: "Attention region",
    scroll: "Scroll to explore",
  },

  hi: {
    navHow: "कैसे काम करता है",
    navExplain: "व्याख्यात्मक AI",
    navPlatform: "प्लेटफ़ॉर्म",
    signIn: "साइन इन →",
    badge: "AI-सहायित डायबिटिक रेटिनोपैथी स्क्रीनिंग",
    title1: "बुद्धिमान रेटिनल",
    title2: "स्क्रीनिंग के लिए",
    title3: "समय पर कार्रवाई।",
    description:
      "RetinaScreen स्वास्थ्य कर्मियों को डायबिटिक रेटिनोपैथी पैटर्न पहचानने, AI निष्कर्ष समझने और समय पर विशेषज्ञ रेफरल में सहायता देने के लिए AI-सहायित फंडस इमेज स्क्रीनिंग प्रदान करता है।",
    start: "स्क्रीनिंग शुरू करें",
    workflow: "वर्कफ़्लो देखें",
    ai: "AI-सहायित",
    explainable: "व्याख्यात्मक",
    offline: "ऑफ़लाइन-तैयार",
    doctor: "डॉक्टर सत्यापन",
    workflowLabel: "वर्कफ़्लो",
    workflowTitle1: "रेटिनल इमेज से",
    workflowTitle2: "क्लिनिकल समीक्षा तक।",
    workflowText:
      "प्राथमिक स्वास्थ्य केंद्रों के लिए बनाया गया स्क्रीनिंग वर्कफ़्लो, जिसमें AI सहायता और विशेषज्ञ सत्यापन शामिल है।",
    platform: "प्लेटफ़ॉर्म देखें →",
    register: "पंजीकरण",
    registerText:
      "मरीज़ रिकॉर्ड बनाएं और स्क्रीनिंग शुरू करें।",
    capture: "कैप्चर",
    captureText:
      "फंडस इमेज अपलोड करें और उसकी गुणवत्ता जांचें।",
    analyze: "विश्लेषण",
    analyzeText:
      "AI मॉडल रेटिनल पैटर्न का विश्लेषण करते हैं।",
    refer: "रेफर",
    referText:
      "जोखिम जानकारी विशेषज्ञ रेफरल में सहायता करती है।",
    explainLabel: "व्याख्यात्मक AI",
    explainTitle1: "सिर्फ परिणाम",
    explainTitle2: "न दिखाएं।",
    explainTitle3: "कारण भी दिखाएं।",
    explainText:
      "स्क्रीनिंग वर्कफ़्लो बीमारी की ग्रेडिंग, लेज़न विज़ुअलाइज़ेशन और मॉडल व्याख्या को जोड़ता है।",
    severity: "DR गंभीरता",
    severityText: "ग्रेड 0–4 स्क्रीनिंग मूल्यांकन।",
    lesions: "लेज़न मैप",
    lesionsText:
      "रेटिनल पैटर्न को विज़ुअलाइज़ करें।",
    gradcam: "Grad-CAM",
    gradcamText:
      "मॉडल को प्रभावित करने वाले क्षेत्रों को दिखाएं।",
    review: "डॉक्टर समीक्षा",
    reviewText:
      "अंतिम क्लिनिकल निर्णय डॉक्टर का रहेगा।",
    access: "प्लेटफ़ॉर्म एक्सेस",
    accessTitle1: "एक प्लेटफ़ॉर्म।",
    accessTitle2: "तीन वर्कस्पेस।",
    accessText:
      "प्रत्येक भूमिका को स्क्रीनिंग वर्कफ़्लो के लिए आवश्यक उपकरण मिलते हैं।",
    healthWorker: "स्वास्थ्य कर्मी",
    healthWorkerText:
      "मरीज़ पंजीकृत करें, स्क्रीनिंग करें और रेफरल प्रबंधित करें।",
    doctorRole: "डॉक्टर",
    doctorText:
      "रेफर किए गए मामलों की समीक्षा करें और AI निष्कर्ष सत्यापित करें।",
    admin: "प्रशासक",
    adminText:
      "स्वास्थ्य कर्मियों, सुविधाओं, स्क्रीनिंग और रेफरल की निगरानी करें।",
    hwLogin: "स्वास्थ्य कर्मी लॉगिन",
    doctorLogin: "डॉक्टर लॉगिन",
    adminLogin: "एडमिन लॉगिन",
    offlineLabel: "ऑफ़लाइन-प्रथम",
    offlineTitle:
      "कनेक्टिविटी जाने पर स्क्रीनिंग नहीं रुकनी चाहिए।",
    offlineText:
      "स्थानीय स्टोरेज और ऑफ़लाइन-प्रथम वर्कफ़्लो के माध्यम से स्क्रीनिंग जारी रखी जा सकती है और कनेक्शन वापस आने पर सिंक किया जा सकता है।",
    footerText:
      "AI-सहायित डायबिटिक रेटिनोपैथी स्क्रीनिंग प्लेटफ़ॉर्म",
    clinical:
      "केवल AI-सहायित स्क्रीनिंग। क्लिनिकल समीक्षा आवश्यक है।",
    quality: "इमेज गुणवत्ता",
    qualityChecked: "गुणवत्ता जांची गई",
    model: "मॉडल",
    vision: "Vision AI",
    analysis: "AI विश्लेषण",
    visualEvidence: "दृश्य प्रमाण",
    attention: "ध्यान क्षेत्र",
    scroll: "एक्सप्लोर करने के लिए स्क्रॉल करें",
  },

  as: {
    navHow: "কেনেকৈ কাম কৰে",
    navExplain: "ব্যাখ্যাযোগ্য AI",
    navPlatform: "প্লেটফৰ্ম",
    signIn: "ছাইন ইন →",
    badge: "AI-সহায়িত ডায়েবেটিক ৰেটিনোপেথি স্ক্ৰিনিং",
    title1: "বুদ্ধিমান ৰেটিনেল",
    title2: "স্ক্ৰিনিংৰ বাবে",
    title3: "আগতীয়া ব্যৱস্থা।",
    description:
      "RetinaScreen-এ স্বাস্থ্যকৰ্মীসকলক ডায়েবেটিক ৰেটিনোপেথিৰ পেটাৰ্ন চিনাক্ত, AI ফলাফল বুজিবলৈ আৰু সময়মতে বিশেষজ্ঞৰ ওচৰলৈ ৰেফাৰ কৰাত সহায় কৰে।",
    start: "স্ক্ৰিনিং আৰম্ভ কৰক",
    workflow: "ৱৰ্কফ্ল' চাওক",
    ai: "AI-সহায়িত",
    explainable: "ব্যাখ্যাযোগ্য",
    offline: "অফলাইন-প্ৰস্তুত",
    doctor: "ডাক্তৰৰ যাচাই",
    workflowLabel: "ৱৰ্কফ্ল'",
    workflowTitle1: "ৰেটিনেল ইমেজৰ পৰা",
    workflowTitle2: "ক্লিনিকেল পৰ্যালোচনালৈ।",
    workflowText:
      "প্ৰাথমিক স্বাস্থ্য সেৱাৰ পৰিৱেশৰ বাবে নিৰ্মিত AI-সহায়িত স্ক্ৰিনিং ৱৰ্কফ্ল'।",
    platform: "প্লেটফৰ্ম চাওক →",
    register: "পঞ্জীয়ন",
    registerText:
      "ৰোগীৰ ৰেকৰ্ড সৃষ্টি কৰি স্ক্ৰিনিং আৰম্ভ কৰক।",
    capture: "কেপচাৰ",
    captureText:
      "ফাণ্ডাছ ইমেজ আপলোড কৰি গুণগত মান পৰীক্ষা কৰক।",
    analyze: "বিশ্লেষণ",
    analyzeText:
      "AI মডেলে ৰেটিনেল পেটাৰ্ন বিশ্লেষণ কৰে।",
    refer: "ৰেফাৰ",
    referText:
      "ঝুঁকি তথ্যই বিশেষজ্ঞ ৰেফাৰত সহায় কৰে।",
    explainLabel: "ব্যাখ্যাযোগ্য AI",
    explainTitle1: "কেৱল ফলাফল",
    explainTitle2: "নেদেখুৱাব।",
    explainTitle3: "কাৰণো দেখুৱাওক।",
    explainText:
      "স্ক্ৰিনিং ৱৰ্কফ্ল'ত ৰোগৰ গ্ৰেডিং, লেজন ভিজুৱেলাইজেচন আৰু মডেল ব্যাখ্যা একত্ৰিত কৰা হৈছে।",
    severity: "DR গুৰুত্ব",
    severityText:
      "গ্ৰেড 0–4 স্ক্ৰিনিং মূল্যায়ন।",
    lesions: "লেজন মেপ",
    lesionsText:
      "ৰেটিনেল পেটাৰ্ন দৃশ্যমান কৰক।",
    gradcam: "Grad-CAM",
    gradcamText:
      "মডেলক প্ৰভাৱিত কৰা অঞ্চল দেখুৱাওক।",
    review: "ডাক্তৰৰ পৰ্যালোচনা",
    reviewText:
      "চূড়ান্ত ক্লিনিকেল সিদ্ধান্ত ডাক্তৰৰ।",
    access: "প্লেটফৰ্ম এক্সেছ",
    accessTitle1: "এটা প্লেটফৰ্ম।",
    accessTitle2: "তিনিটা ৱৰ্কস্পেচ।",
    accessText:
      "প্ৰতিটো ভূমিকাৰ বাবে স্ক্ৰিনিং ৱৰ্কফ্ল'ৰ প্ৰয়োজনীয় সঁজুলি আছে।",
    healthWorker: "স্বাস্থ্যকৰ্মী",
    healthWorkerText:
      "ৰোগী পঞ্জীয়ন, স্ক্ৰিনিং আৰু ৰেফাৰেল পৰিচালনা কৰক।",
    doctorRole: "ডাক্টৰ",
    doctorText:
      "ৰেফাৰ কৰা কেছ পৰ্যালোচনা আৰু AI ফলাফল যাচাই কৰক।",
    admin: "প্ৰশাসক",
    adminText:
      "স্বাস্থ্যকৰ্মী, সুবিধা, স্ক্ৰিনিং আৰু ৰেফাৰেল নিৰীক্ষণ কৰক।",
    hwLogin: "স্বাস্থ্যকৰ্মী লগইন",
    doctorLogin: "ডাক্তৰ লগইন",
    adminLogin: "এডমিন লগইন",
    offlineLabel: "অফলাইন-প্ৰথম",
    offlineTitle:
      "ইণ্টাৰনেট সংযোগ নাথাকিলেও স্ক্ৰিনিং চলিব লাগে।",
    offlineText:
      "স্থানীয় ষ্ট'ৰেজ আৰু অফলাইন-প্ৰথম ৱৰ্কফ্ল'ৰ সহায়ত কাম চলাই যাব পাৰি আৰু সংযোগ ঘূৰি আহিলে ডাটা ছিংক কৰিব পাৰি।",
    footerText:
      "AI-সহায়িত ডায়েবেটিক ৰেটিনোপেথি স্ক্ৰিনিং প্লেটফৰ্ম",
    clinical:
      "কেৱল AI-সহায়িত স্ক্ৰিনিং। ক্লিনিকেল পৰ্যালোচনা প্ৰয়োজনীয়।",
    quality: "ইমেজ গুণগত মান",
    qualityChecked: "গুণগত মান পৰীক্ষিত",
    model: "মডেল",
    vision: "Vision AI",
    analysis: "AI বিশ্লেষণ",
    visualEvidence: "দৃশ্যমান প্ৰমাণ",
    attention: "মনোযোগ অঞ্চল",
    scroll: "অন্বেষণ কৰিবলৈ স্ক্ৰল কৰক",
  },

  bn: {
    navHow: "কীভাবে কাজ করে",
    navExplain: "ব্যাখ্যাযোগ্য AI",
    navPlatform: "প্ল্যাটফর্ম",
    signIn: "সাইন ইন →",
    badge: "AI-সহায়িত ডায়াবেটিক রেটিনোপ্যাথি স্ক্রিনিং",
    title1: "বুদ্ধিমান রেটিনাল",
    title2: "স্ক্রিনিংয়ের জন্য",
    title3: "আগাম পদক্ষেপ।",
    description:
      "RetinaScreen স্বাস্থ্যকর্মীদের ডায়াবেটিক রেটিনোপ্যাথির প্যাটার্ন শনাক্ত করতে, AI ফলাফল বুঝতে এবং সময়মতো বিশেষজ্ঞের কাছে রেফার করতে সহায়তা করে।",
    start: "স্ক্রিনিং শুরু করুন",
    workflow: "ওয়ার্কফ্লো দেখুন",
    ai: "AI-সহায়িত",
    explainable: "ব্যাখ্যাযোগ্য",
    offline: "অফলাইন-প্রস্তুত",
    doctor: "ডাক্তারের যাচাই",
    workflowLabel: "ওয়ার্কফ্লো",
    workflowTitle1: "রেটিনাল ইমেজ থেকে",
    workflowTitle2: "ক্লিনিক্যাল পর্যালোচনায়।",
    workflowText:
      "প্রাথমিক স্বাস্থ্যসেবা পরিবেশের জন্য তৈরি AI-সহায়িত স্ক্রিনিং ওয়ার্কফ্লো।",
    platform: "প্ল্যাটফর্ম দেখুন →",
    register: "নিবন্ধন",
    registerText:
      "রোগীর রেকর্ড তৈরি করে স্ক্রিনিং শুরু করুন।",
    capture: "ক্যাপচার",
    captureText:
      "ফান্ডাস ইমেজ আপলোড করে মান যাচাই করুন।",
    analyze: "বিশ্লেষণ",
    analyzeText:
      "AI মডেল রেটিনাল প্যাটার্ন বিশ্লেষণ করে।",
    refer: "রেফার",
    referText:
      "ঝুঁকির তথ্য বিশেষজ্ঞ রেফারে সহায়তা করে।",
    explainLabel: "ব্যাখ্যাযোগ্য AI",
    explainTitle1: "শুধু ফলাফল",
    explainTitle2: "দেখাবেন না।",
    explainTitle3: "কারণও দেখান।",
    explainText:
      "স্ক্রিনিং ওয়ার্কফ্লো রোগের গ্রেডিং, লেশন ভিজ্যুয়ালাইজেশন এবং মডেল ব্যাখ্যাকে একত্রিত করে।",
    severity: "DR তীব্রতা",
    severityText:
      "গ্রেড 0–4 স্ক্রিনিং মূল্যায়ন।",
    lesions: "লেশন ম্যাপ",
    lesionsText:
      "রেটিনাল প্যাটার্ন দেখুন।",
    gradcam: "Grad-CAM",
    gradcamText:
      "মডেলকে প্রভাবিত করা অঞ্চল দেখান।",
    review: "ডাক্তারের পর্যালোচনা",
    reviewText:
      "চূড়ান্ত ক্লিনিক্যাল সিদ্ধান্ত ডাক্তারের।",
    access: "প্ল্যাটফর্ম অ্যাক্সেস",
    accessTitle1: "একটি প্ল্যাটফর্ম।",
    accessTitle2: "তিনটি ওয়ার্কস্পেস।",
    accessText:
      "প্রতিটি ভূমিকার জন্য প্রয়োজনীয় স্ক্রিনিং টুল রয়েছে।",
    healthWorker: "স্বাস্থ্যকর্মী",
    healthWorkerText:
      "রোগী নিবন্ধন, স্ক্রিনিং এবং রেফারেল পরিচালনা করুন।",
    doctorRole: "ডাক্তার",
    doctorText:
      "রেফার করা কেস পর্যালোচনা এবং AI ফলাফল যাচাই করুন।",
    admin: "প্রশাসক",
    adminText:
      "স্বাস্থ্যকর্মী, সুবিধা, স্ক্রিনিং এবং রেফারেল পর্যবেক্ষণ করুন।",
    hwLogin: "স্বাস্থ্যকর্মী লগইন",
    doctorLogin: "ডাক্তার লগইন",
    adminLogin: "অ্যাডমিন লগইন",
    offlineLabel: "অফলাইন-প্রথম",
    offlineTitle:
      "সংযোগ না থাকলেও স্ক্রিনিং বন্ধ হওয়া উচিত নয়।",
    offlineText:
      "স্থানীয় স্টোরেজ ও অফলাইন-প্রথম ওয়ার্কফ্লোর মাধ্যমে কাজ চালিয়ে যাওয়া যায় এবং সংযোগ ফিরে এলে ডেটা সিঙ্ক করা যায়।",
    footerText:
      "AI-সহায়িত ডায়াবেটিক রেটিনোপ্যাথি স্ক্রিনিং প্ল্যাটফর্ম",
    clinical:
      "শুধুমাত্র AI-সহায়িত স্ক্রিনিং। ক্লিনিক্যাল পর্যালোচনা প্রয়োজন।",
    quality: "ইমেজের মান",
    qualityChecked: "মান যাচাই করা হয়েছে",
    model: "মডেল",
    vision: "Vision AI",
    analysis: "AI বিশ্লেষণ",
    visualEvidence: "দৃশ্যমান প্রমাণ",
    attention: "মনোযোগ অঞ্চল",
    scroll: "অন্বেষণ করতে স্ক্রল করুন",
  },

  kn: {
    navHow: "ಹೇಗೆ ಕೆಲಸ ಮಾಡುತ್ತದೆ",
    navExplain: "ವಿವರಣಾತ್ಮಕ AI",
    navPlatform: "ಪ್ಲಾಟ್‌ಫಾರ್ಮ್",
    signIn: "ಸೈನ್ ಇನ್ →",
    badge: "AI-ಸಹಾಯಿತ ಡಯಾಬೆಟಿಕ್ ರೆಟಿನೋಪತಿ ಸ್ಕ್ರೀನಿಂಗ್",
    title1: "ಬುದ್ಧಿವಂತ ರೆಟಿನಲ್",
    title2: "ಸ್ಕ್ರೀನಿಂಗ್‌ಗಾಗಿ",
    title3: "ಮುಂಚಿತ ಕ್ರಮ.",
    description:
      "RetinaScreen ಆರೋಗ್ಯ ಕಾರ್ಯಕರ್ತರಿಗೆ ಡಯಾಬೆಟಿಕ್ ರೆಟಿನೋಪತಿಯ ಮಾದರಿಗಳನ್ನು ಗುರುತಿಸಲು, AI ಫಲಿತಾಂಶಗಳನ್ನು ಅರ್ಥಮಾಡಿಕೊಳ್ಳಲು ಮತ್ತು ತಜ್ಞರ ರೆಫರಲ್‌ಗೆ ಸಹಾಯ ಮಾಡುತ್ತದೆ.",
    start: "ಸ್ಕ್ರೀನಿಂಗ್ ಪ್ರಾರಂಭಿಸಿ",
    workflow: "ವರ್ಕ್‌ಫ್ಲೋ ನೋಡಿ",
    ai: "AI-ಸಹಾಯಿತ",
    explainable: "ವಿವರಣಾತ್ಮಕ",
    offline: "ಆಫ್‌ಲೈನ್ ಸಿದ್ಧ",
    doctor: "ವೈದ್ಯರ ಪರಿಶೀಲನೆ",
    workflowLabel: "ವರ್ಕ್‌ಫ್ಲೋ",
    workflowTitle1: "ರೆಟಿನಲ್ ಚಿತ್ರದಿಂದ",
    workflowTitle2: "ಕ್ಲಿನಿಕಲ್ ಪರಿಶೀಲನೆಗೆ.",
    workflowText:
      "ಪ್ರಾಥಮಿಕ ಆರೋಗ್ಯ ಸೇವಾ ಪರಿಸರಕ್ಕಾಗಿ ವಿನ್ಯಾಸಗೊಳಿಸಲಾದ AI-ಸಹಾಯಿತ ಸ್ಕ್ರೀನಿಂಗ್ ವರ್ಕ್‌ಫ್ಲೋ.",
    platform: "ಪ್ಲಾಟ್‌ಫಾರ್ಮ್ ನೋಡಿ →",
    register: "ನೋಂದಣಿ",
    registerText:
      "ರೋಗಿಯ ದಾಖಲೆ ರಚಿಸಿ ಸ್ಕ್ರೀನಿಂಗ್ ಪ್ರಾರಂಭಿಸಿ.",
    capture: "ಕ್ಯಾಪ್ಚರ್",
    captureText:
      "ಫಂಡಸ್ ಚಿತ್ರವನ್ನು ಅಪ್‌ಲೋಡ್ ಮಾಡಿ ಗುಣಮಟ್ಟ ಪರಿಶೀಲಿಸಿ.",
    analyze: "ವಿಶ್ಲೇಷಣೆ",
    analyzeText:
      "AI ಮಾದರಿಗಳು ರೆಟಿನಲ್ ಮಾದರಿಗಳನ್ನು ವಿಶ್ಲೇಷಿಸುತ್ತವೆ.",
    refer: "ರೆಫರ್",
    referText:
      "ಅಪಾಯದ ಮಾಹಿತಿಯು ತಜ್ಞರ ರೆಫರಲ್‌ಗೆ ಸಹಾಯ ಮಾಡುತ್ತದೆ.",
    explainLabel: "ವಿವರಣಾತ್ಮಕ AI",
    explainTitle1: "ಫಲಿತಾಂಶವನ್ನು",
    explainTitle2: "ಮಾತ್ರ ತೋರಿಸಬೇಡಿ.",
    explainTitle3: "ಕಾರಣವನ್ನೂ ತೋರಿಸಿ.",
    explainText:
      "ಸ್ಕ್ರೀನಿಂಗ್ ವರ್ಕ್‌ಫ್ಲೋ ರೋಗದ ಗ್ರೇಡಿಂಗ್, ಲೆಷನ್ ದೃಶ್ಯೀಕರಣ ಮತ್ತು ಮಾದರಿ ವಿವರಣೆಯನ್ನು ಒಟ್ಟುಗೂಡಿಸುತ್ತದೆ.",
    severity: "DR ತೀವ್ರತೆ",
    severityText:
      "ಗ್ರೇಡ್ 0–4 ಸ್ಕ್ರೀನಿಂಗ್ ಮೌಲ್ಯಮಾಪನ.",
    lesions: "ಲೆಷನ್ ಮ್ಯಾಪ್",
    lesionsText:
      "ರೆಟಿನಲ್ ಮಾದರಿಗಳನ್ನು ದೃಶ್ಯೀಕರಿಸಿ.",
    gradcam: "Grad-CAM",
    gradcamText:
      "ಮಾದರಿಯ ಮೇಲೆ ಪ್ರಭಾವ ಬೀರುವ ಪ್ರದೇಶಗಳನ್ನು ತೋರಿಸಿ.",
    review: "ವೈದ್ಯರ ಪರಿಶೀಲನೆ",
    reviewText:
      "ಅಂತಿಮ ಕ್ಲಿನಿಕಲ್ ನಿರ್ಧಾರ ವೈದ್ಯರದು.",
    access: "ಪ್ಲಾಟ್‌ಫಾರ್ಮ್ ಪ್ರವೇಶ",
    accessTitle1: "ಒಂದು ಪ್ಲಾಟ್‌ಫಾರ್ಮ್.",
    accessTitle2: "ಮೂರು ವರ್ಕ್‌ಸ್ಪೇಸ್‌ಗಳು.",
    accessText:
      "ಪ್ರತಿ ಪಾತ್ರಕ್ಕೆ ಅಗತ್ಯವಾದ ಸ್ಕ್ರೀನಿಂಗ್ ಸಾಧನಗಳನ್ನು ಒದಗಿಸಲಾಗಿದೆ.",
    healthWorker: "ಆರೋಗ್ಯ ಕಾರ್ಯಕರ್ತ",
    healthWorkerText:
      "ರೋಗಿಗಳನ್ನು ನೋಂದಾಯಿಸಿ, ಸ್ಕ್ರೀನಿಂಗ್ ಮಾಡಿ ಮತ್ತು ರೆಫರಲ್ ನಿರ್ವಹಿಸಿ.",
    doctorRole: "ವೈದ್ಯ",
    doctorText:
      "ರೆಫರ್ ಮಾಡಿದ ಪ್ರಕರಣಗಳನ್ನು ಪರಿಶೀಲಿಸಿ ಮತ್ತು AI ಫಲಿತಾಂಶಗಳನ್ನು ಮೌಲ್ಯಮಾಪನ ಮಾಡಿ.",
    admin: "ನಿರ್ವಾಹಕರು",
    adminText:
      "ಆರೋಗ್ಯ ಕಾರ್ಯಕರ್ತರು, ಸೌಲಭ್ಯಗಳು, ಸ್ಕ್ರೀನಿಂಗ್ ಮತ್ತು ರೆಫರಲ್‌ಗಳನ್ನು ಮೇಲ್ವಿಚಾರಣೆ ಮಾಡಿ.",
    hwLogin: "ಆರೋಗ್ಯ ಕಾರ್ಯಕರ್ತ ಲಾಗಿನ್",
    doctorLogin: "ವೈದ್ಯರ ಲಾಗಿನ್",
    adminLogin: "ಅಡ್ಮಿನ್ ಲಾಗಿನ್",
    offlineLabel: "ಆಫ್‌ಲೈನ್-ಮೊದಲು",
    offlineTitle:
      "ಸಂಪರ್ಕ ಇಲ್ಲದಿದ್ದರೂ ಸ್ಕ್ರೀನಿಂಗ್ ನಿಲ್ಲಬಾರದು.",
    offlineText:
      "ಸ್ಥಳೀಯ ಸಂಗ್ರಹಣೆ ಮತ್ತು ಆಫ್‌ಲೈನ್ ವರ್ಕ್‌ಫ್ಲೋ ಮೂಲಕ ಕೆಲಸ ಮುಂದುವರಿಸಿ ಮತ್ತು ಸಂಪರ್ಕ ಮರಳಿದಾಗ ಡೇಟಾವನ್ನು ಸಿಂಕ್ ಮಾಡಬಹುದು.",
    footerText:
      "AI-ಸಹಾಯಿತ ಡಯಾಬೆಟಿಕ್ ರೆಟಿನೋಪತಿ ಸ್ಕ್ರೀನಿಂಗ್ ಪ್ಲಾಟ್‌ಫಾರ್ಮ್",
    clinical:
      "AI-ಸಹಾಯಿತ ಸ್ಕ್ರೀನಿಂಗ್ ಮಾತ್ರ. ಕ್ಲಿನಿಕಲ್ ಪರಿಶೀಲನೆ ಅಗತ್ಯ.",
    quality: "ಚಿತ್ರದ ಗುಣಮಟ್ಟ",
    qualityChecked: "ಗುಣಮಟ್ಟ ಪರಿಶೀಲಿಸಲಾಗಿದೆ",
    model: "ಮಾದರಿ",
    vision: "Vision AI",
    analysis: "AI ವಿಶ್ಲೇಷಣೆ",
    visualEvidence: "ದೃಶ್ಯ ಸಾಕ್ಷ್ಯ",
    attention: "ಗಮನ ಪ್ರದೇಶ",
    scroll: "ಅನ್ವೇಷಿಸಲು ಸ್ಕ್ರಾಲ್ ಮಾಡಿ",
  },
};

type TranslationSet = (typeof translations)["en"];

export default function Home() {
  const { language } = useTheme();

  const t: TranslationSet =
    translations[language as Language] ??
    translations.en;

  return (
    <main className="min-h-screen overflow-x-hidden bg-[var(--app-bg)] text-[var(--app-text)] transition-colors duration-300">
      {/* ================= NAVBAR ================= */}
      <nav className="fixed left-0 right-0 top-0 z-50 border-b border-[var(--app-border)] bg-[var(--app-surface)]/90 backdrop-blur-2xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <Link
            href="/"
            className="text-xl font-bold tracking-tight text-[var(--app-heading)]"
          >
            Retina
            <span className="text-[var(--accent)]">
              Screen
            </span>
          </Link>

          {/* DESKTOP */}
          <div className="hidden items-center gap-3 md:flex">
            <a
              href="#how-it-works"
              className="top-nav-button"
            >
              {t.navHow}
            </a>

            <a
              href="#explainable"
              className="top-nav-button"
            >
              {t.navExplain}
            </a>

            <a
              href="#roles"
              className="top-nav-button"
            >
              {t.navPlatform}
            </a>

            <ThemeLanguageSelector />

            <Link
              href="/login"
              className="ml-1 rounded-xl border border-[var(--accent)]/40 bg-[var(--accent-soft)] px-5 py-2.5 text-sm font-semibold text-[var(--accent)] transition-all hover:-translate-y-0.5 hover:bg-[var(--accent-soft-strong)]"
            >
              {t.signIn}
            </Link>
          </div>

          {/* MOBILE */}
          <div className="flex items-center gap-2 md:hidden">
            <ThemeLanguageSelector />

            <Link
              href="/login"
              className="rounded-xl border border-[var(--accent)]/40 bg-[var(--accent-soft)] px-4 py-2.5 text-sm font-semibold text-[var(--accent)]"
            >
              {t.signIn}
            </Link>
          </div>
        </div>
      </nav>

      {/* ================= HERO ================= */}
      <section className="relative min-h-screen overflow-hidden pt-24">
        <div className="pointer-events-none absolute left-[-250px] top-[150px] h-[600px] w-[600px] rounded-full bg-cyan-500/10 blur-[150px]" />

        <div className="pointer-events-none absolute right-[-250px] top-[100px] h-[650px] w-[650px] rounded-full bg-violet-600/10 blur-[160px]" />

        <div className="pointer-events-none absolute left-1/2 top-[30%] h-[400px] w-[400px] -translate-x-1/2 rounded-full bg-emerald-400/[0.025] blur-[100px]" />

        <div className="mx-auto grid min-h-[calc(100vh-6rem)] max-w-7xl items-center gap-12 px-6 py-16 lg:grid-cols-[1.05fr_0.95fr]">
          <div className="relative z-10">
            <div className="mb-7 inline-flex items-center gap-3 rounded-full border border-[var(--accent)]/30 bg-[var(--accent-soft)] px-4 py-2.5">
              <span className="relative flex h-2.5 w-2.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[var(--accent)] opacity-60" />

                <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-[var(--accent)]" />
              </span>

              <span className="text-sm font-medium text-[var(--accent)]">
                {t.badge}
              </span>
            </div>

            <h1 className="max-w-4xl text-5xl font-bold leading-[1.02] tracking-[-0.04em] text-[var(--app-heading)] sm:text-6xl lg:text-[72px]">
              {t.title1}
              <br />
              {t.title2}
              <br />

              <span className="bg-gradient-to-r from-cyan-400 via-violet-500 to-pink-500 bg-clip-text text-transparent">
                {t.title3}
              </span>
            </h1>

            <p className="mt-7 max-w-xl text-lg leading-8 text-[var(--app-muted)]">
              {t.description}
            </p>

            <div className="mt-9 flex flex-wrap gap-4">
              <Link
                href="/login/health-worker"
                className="group rounded-2xl bg-gradient-to-r from-cyan-400 to-emerald-400 px-7 py-4 font-semibold text-slate-950 shadow-lg shadow-cyan-950/20 transition hover:-translate-y-1"
              >
                <span className="flex items-center gap-2">
                  {t.start}

                  <span className="transition-transform group-hover:translate-x-1">
                    →
                  </span>
                </span>
              </Link>

              <a
                href="#how-it-works"
                className="group rounded-2xl border border-[var(--accent)]/30 bg-[var(--accent-soft)] px-7 py-4 font-semibold text-[var(--app-heading)] transition hover:-translate-y-1 hover:bg-[var(--accent-soft-strong)]"
              >
                <span className="flex items-center gap-2">
                  {t.workflow}

                  <span className="transition-transform group-hover:translate-y-1">
                    ↓
                  </span>
                </span>
              </a>
            </div>

            <div className="mt-10 flex flex-wrap gap-3">
              <TrustBadge
                text={t.ai}
                color="cyan"
              />

              <TrustBadge
                text={t.explainable}
                color="violet"
              />

              <TrustBadge
                text={t.offline}
                color="emerald"
              />

              <TrustBadge
                text={t.doctor}
                color="amber"
              />
            </div>
          </div>

          {/* HERO OBJECT */}
          <div className="relative flex min-h-[570px] items-center justify-center [perspective:1200px]">
            <div className="absolute h-[520px] w-[520px] rounded-full border border-cyan-400/[0.07]" />

            <div className="absolute h-[450px] w-[450px] rounded-full border border-violet-400/[0.08]" />

            <div className="absolute h-[375px] w-[375px] rounded-full border border-emerald-400/[0.1]" />

            <div className="absolute h-[480px] w-[480px] rounded-full border border-dashed border-violet-400/20">
              <div className="absolute -left-1 top-1/2 h-3 w-3 rounded-full bg-cyan-400 shadow-[0_0_25px_rgba(34,211,238,0.9)]" />

              <div className="absolute right-[18%] top-[8%] h-2.5 w-2.5 rounded-full bg-violet-400 shadow-[0_0_20px_rgba(167,139,250,0.8)]" />
            </div>

            <div className="relative h-[350px] w-[350px] [transform:rotateX(16deg)_rotateY(-18deg)] [transform-style:preserve-3d]">
              <div className="absolute inset-[-40px] rounded-full bg-gradient-to-r from-cyan-400/10 via-violet-400/10 to-pink-400/10 blur-3xl" />

              <div className="absolute inset-0 rounded-full border border-[var(--app-border)] bg-gradient-to-br from-slate-400 via-slate-700 to-slate-950 shadow-[inset_-25px_-25px_70px_rgba(0,0,0,0.35),0_30px_100px_rgba(0,0,0,0.25)]" />

              <div className="absolute left-[9%] top-[9%] h-[82%] w-[82%] rounded-full border border-violet-300/20 bg-slate-950">
                <div className="absolute left-[15%] top-[15%] h-[70%] w-[70%] rounded-full border-[14px] border-violet-400/20">
                  <div className="absolute left-[12%] top-[12%] h-[76%] w-[76%] rounded-full bg-gradient-to-br from-cyan-950/30 via-violet-950/20 to-black">
                    <div className="absolute left-[39%] top-[39%] h-[22%] w-[22%] rounded-full border border-amber-200/40 bg-amber-400/70 shadow-[0_0_50px_rgba(251,191,36,0.8)]" />

                    <div className="absolute left-[18%] top-[46%] h-1.5 w-[42%] rotate-[17deg] rounded-full bg-cyan-300/30" />

                    <div className="absolute left-[48%] top-[35%] h-1.5 w-[35%] rotate-[-35deg] rounded-full bg-violet-300/30" />

                    <div className="absolute left-[46%] top-[59%] h-1.5 w-[37%] rotate-[30deg] rounded-full bg-pink-300/25" />

                    <div className="absolute left-[32%] top-[22%] h-1 w-[25%] rotate-[70deg] rounded-full bg-emerald-300/25" />
                  </div>
                </div>
              </div>

              {/* Analysis card */}
              <div className="absolute -right-14 top-8 w-40 rounded-2xl border border-violet-400/20 bg-[var(--app-surface)]/95 p-4 shadow-xl backdrop-blur-xl [transform:translateZ(70px)]">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-[var(--app-muted)]">
                    {t.analysis}
                  </span>

                  <span className="h-2 w-2 rounded-full bg-violet-400" />
                </div>

                <p className="mt-2 text-sm font-semibold text-violet-500">
                  {t.explainable}
                </p>
              </div>

              {/* Quality card */}
              <div className="absolute -bottom-8 -left-14 w-44 rounded-2xl border border-emerald-400/20 bg-[var(--app-surface)]/95 p-4 shadow-xl backdrop-blur-xl [transform:translateZ(60px)]">
                <p className="text-xs text-[var(--app-muted)]">
                  {t.quality}
                </p>

                <div className="mt-2 flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-emerald-400" />

                  <span className="text-sm font-semibold text-[var(--app-text)]">
                    {t.qualityChecked}
                  </span>
                </div>
              </div>

              {/* Model card */}
              <div className="absolute -left-12 top-20 rounded-xl border border-cyan-400/20 bg-[var(--app-surface)]/95 px-3 py-2 shadow-xl backdrop-blur-xl [transform:translateZ(50px)]">
                <p className="text-[11px] text-[var(--app-muted)]">
                  {t.model}
                </p>

                <p className="text-xs font-semibold text-cyan-500">
                  {t.vision}
                </p>
              </div>
            </div>
          </div>
        </div>

        <a
          href="#how-it-works"
          className="absolute bottom-7 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-2 text-xs text-[var(--app-muted)] transition hover:text-[var(--accent)] md:flex"
        >
          <span>{t.scroll}</span>

          <span className="h-8 w-px bg-gradient-to-b from-cyan-400 via-violet-400 to-transparent" />
        </a>
      </section>

      {/* ================= WORKFLOW ================= */}
      <section
        id="how-it-works"
        className="relative border-t border-[var(--app-border)] bg-[var(--app-bg-secondary)] py-28"
      >
        <div className="absolute right-[-200px] top-20 h-96 w-96 rounded-full bg-violet-500/[0.05] blur-[120px]" />

        <div className="relative mx-auto max-w-7xl px-6">
          <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
            <div className="max-w-2xl">
              <div className="section-pill violet">
                {t.workflowLabel}
              </div>

              <h2 className="mt-5 text-4xl font-bold tracking-tight text-[var(--app-heading)] sm:text-5xl">
                {t.workflowTitle1}
                <br />
                {t.workflowTitle2}
              </h2>

              <p className="mt-5 leading-8 text-[var(--app-muted)]">
                {t.workflowText}
              </p>
            </div>

            <a
              href="#roles"
              className="rounded-xl border border-violet-400/30 bg-violet-400/[0.08] px-5 py-3 text-sm font-semibold text-violet-500 transition hover:bg-violet-400/[0.14]"
            >
              {t.platform}
            </a>
          </div>

          <div className="mt-14 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
            <WorkflowCard
              number="01"
              title={t.register}
              text={t.registerText}
              color="cyan"
            />

            <WorkflowCard
              number="02"
              title={t.capture}
              text={t.captureText}
              color="emerald"
            />

            <WorkflowCard
              number="03"
              title={t.analyze}
              text={t.analyzeText}
              color="violet"
            />

            <WorkflowCard
              number="04"
              title={t.refer}
              text={t.referText}
              color="rose"
            />
          </div>
        </div>
      </section>

      {/* ================= EXPLAINABLE AI ================= */}
      <section
        id="explainable"
        className="relative overflow-hidden bg-[var(--app-bg)] py-28"
      >
        <div className="absolute left-[-200px] top-1/2 h-[500px] w-[500px] -translate-y-1/2 rounded-full bg-amber-500/[0.04] blur-[130px]" />

        <div className="relative mx-auto grid max-w-7xl items-center gap-16 px-6 lg:grid-cols-2">
          <div>
            <div className="section-pill amber">
              {t.explainLabel}
            </div>

            <h2 className="mt-5 text-4xl font-bold tracking-tight text-[var(--app-heading)] sm:text-5xl">
              {t.explainTitle1}
              <br />
              {t.explainTitle2}
              <br />

              <span className="text-amber-500">
                {t.explainTitle3}
              </span>
            </h2>

            <p className="mt-6 max-w-xl text-base leading-8 text-[var(--app-muted)]">
              {t.explainText}
            </p>

            <div className="mt-9 grid gap-4 sm:grid-cols-2">
              <FeatureCard
                number="01"
                title={t.severity}
                text={t.severityText}
                color="rose"
              />

              <FeatureCard
                number="02"
                title={t.lesions}
                text={t.lesionsText}
                color="emerald"
              />

              <FeatureCard
                number="03"
                title={t.gradcam}
                text={t.gradcamText}
                color="violet"
              />

              <FeatureCard
                number="04"
                title={t.review}
                text={t.reviewText}
                color="amber"
              />
            </div>
          </div>

          <div className="relative min-h-[520px] overflow-hidden rounded-3xl border border-amber-400/20 bg-[var(--app-surface)] p-8 shadow-2xl [perspective:1000px]">
            <div className="absolute right-[-120px] top-[-120px] h-80 w-80 rounded-full bg-amber-400/[0.08] blur-3xl" />

            <div className="absolute bottom-[-120px] left-[-120px] h-80 w-80 rounded-full bg-violet-500/[0.06] blur-3xl" />

            <div className="relative flex min-h-[450px] items-center justify-center">
              <div className="absolute h-[390px] w-[390px] rounded-full border border-amber-400/20" />

              <div className="absolute h-[320px] w-[320px] rounded-full border border-dashed border-violet-400/20" />

              <div className="relative h-[250px] w-[250px] rounded-full bg-slate-950 shadow-[0_0_100px_rgba(251,191,36,0.1)] [transform:rotateX(15deg)_rotateY(-15deg)]">
                <div className="absolute left-[12%] top-[12%] h-[76%] w-[76%] rounded-full border-[10px] border-violet-400/20 bg-[#02050b]">
                  <div className="absolute left-[24%] top-[24%] h-[52%] w-[52%] rounded-full border border-amber-300/30">
                    <div className="absolute left-[35%] top-[35%] h-[30%] w-[30%] rounded-full bg-amber-400/70 shadow-[0_0_50px_rgba(251,191,36,0.8)]" />
                  </div>

                  <div className="absolute left-[18%] top-[48%] h-1.5 w-[45%] rotate-[20deg] rounded-full bg-emerald-400/30" />

                  <div className="absolute left-[50%] top-[35%] h-1.5 w-[32%] rotate-[-30deg] rounded-full bg-violet-400/25" />

                  <div className="absolute left-[47%] top-[64%] h-1.5 w-[35%] rotate-[25deg] rounded-full bg-rose-400/25" />
                </div>
              </div>

              <div className="absolute left-[17%] top-[27%] h-4 w-4 rounded-full bg-rose-400 shadow-[0_0_30px_rgba(251,113,133,0.8)]" />

              <div className="absolute right-[20%] top-[38%] h-3 w-3 rounded-full bg-violet-400 shadow-[0_0_25px_rgba(167,139,250,0.8)]" />

              <div className="absolute bottom-[24%] left-[31%] h-3 w-3 rounded-full bg-emerald-400 shadow-[0_0_20px_rgba(52,211,153,0.7)]" />

              <div className="absolute left-2 top-10 rounded-2xl border border-violet-400/20 bg-[var(--app-surface)]/95 px-5 py-4 shadow-xl backdrop-blur-xl">
                <p className="text-xs text-[var(--app-muted)]">
                  {t.model}
                </p>

                <p className="mt-1 text-sm font-semibold text-violet-500">
                  {t.attention}
                </p>
              </div>

              <div className="absolute bottom-8 right-2 rounded-2xl border border-amber-400/20 bg-[var(--app-surface)]/95 px-5 py-4 shadow-xl backdrop-blur-xl">
                <p className="text-xs text-[var(--app-muted)]">
                  {t.explainLabel}
                </p>

                <p className="mt-1 text-sm font-semibold text-amber-500">
                  {t.visualEvidence}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================= ROLES ================= */}
      <section
        id="roles"
        className="border-t border-[var(--app-border)] bg-[var(--app-bg-secondary)] py-28"
      >
        <div className="mx-auto max-w-7xl px-6">
          <div className="mx-auto max-w-2xl text-center">
            <div className="section-pill emerald">
              {t.access}
            </div>

            <h2 className="mt-5 text-4xl font-bold text-[var(--app-heading)] sm:text-5xl">
              {t.accessTitle1}
              <br />
              {t.accessTitle2}
            </h2>

            <p className="mt-5 leading-7 text-[var(--app-muted)]">
              {t.accessText}
            </p>
          </div>

          <div className="mt-14 grid gap-6 lg:grid-cols-3">
            <RoleCard
              title={t.healthWorker}
              description={t.healthWorkerText}
              href="/login/health-worker"
              action={t.hwLogin}
              icon="HW"
              color="emerald"
            />

            <RoleCard
              title={t.doctorRole}
              description={t.doctorText}
              href="/login/doctor"
              action={t.doctorLogin}
              icon="DR"
              color="cyan"
            />

            <RoleCard
              title={t.admin}
              description={t.adminText}
              href="/login/admin"
              action={t.adminLogin}
              icon="AD"
              color="violet"
            />
          </div>
        </div>
      </section>

      {/* ================= OFFLINE ================= */}
      <section className="relative bg-[var(--app-bg)] py-28">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-emerald-400/[0.025] to-transparent" />

        <div className="relative mx-auto max-w-6xl px-6">
          <div className="overflow-hidden rounded-3xl border border-emerald-400/20 bg-[var(--app-surface)] shadow-2xl">
            <div className="grid items-center gap-10 p-8 md:p-14 lg:grid-cols-[1fr_auto]">
              <div>
                <div className="section-pill emerald">
                  {t.offlineLabel}
                </div>

                <h2 className="mt-5 max-w-2xl text-4xl font-bold text-[var(--app-heading)]">
                  {t.offlineTitle}
                </h2>

                <p className="mt-5 max-w-2xl leading-8 text-[var(--app-muted)]">
                  {t.offlineText}
                </p>
              </div>

              <Link
                href="/login/health-worker"
                className="rounded-2xl bg-gradient-to-r from-emerald-400 to-cyan-400 px-7 py-4 text-center font-semibold text-slate-950 shadow-lg transition hover:-translate-y-1"
              >
                {t.start}

                <span className="ml-2">
                  →
                </span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ================= FOOTER ================= */}
      <footer className="border-t border-[var(--app-border)] bg-[var(--app-bg-secondary)] py-10">
        <div className="mx-auto flex max-w-7xl flex-col gap-6 px-6 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-lg font-bold text-[var(--app-heading)]">
              Retina
              <span className="text-[var(--accent)]">
                Screen
              </span>
            </p>

            <p className="mt-1 text-xs text-[var(--app-muted)]">
              {t.footerText}
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <a
              href="#how-it-works"
              className="footer-link text-violet-500"
            >
              {t.navHow}
            </a>

            <a
              href="#explainable"
              className="footer-link text-amber-500"
            >
              {t.navExplain}
            </a>

            <a
              href="#roles"
              className="footer-link text-emerald-500"
            >
              {t.navPlatform}
            </a>
          </div>

          <p className="max-w-xs text-xs text-[var(--app-muted)]">
            {t.clinical}
          </p>
        </div>
      </footer>
    </main>
  );
}

/* =========================================================
   TRUST BADGE
========================================================= */

function TrustBadge({
  text,
  color,
}: {
  text: string;
  color:
    | "cyan"
    | "violet"
    | "emerald"
    | "amber";
}) {
  const colors = {
    cyan: "text-cyan-500",
    violet: "text-violet-500",
    emerald: "text-emerald-500",
    amber: "text-amber-500",
  };

  return (
    <div className="rounded-xl border border-[var(--app-border)] bg-[var(--app-surface)] px-4 py-2 text-xs font-medium text-[var(--app-muted)] shadow-sm">
      <span
        className={`mr-2 ${colors[color]}`}
      >
        ✓
      </span>

      {text}
    </div>
  );
}

/* =========================================================
   WORKFLOW CARD
========================================================= */

function WorkflowCard({
  number,
  title,
  text,
  color,
}: {
  number: string;
  title: string;
  text: string;
  color:
    | "cyan"
    | "emerald"
    | "violet"
    | "rose";
}) {
  const styles = {
    cyan: {
      number: "text-cyan-500",
      border: "hover:border-cyan-400/40",
      dot: "bg-cyan-400",
      line: "bg-cyan-400",
    },
    emerald: {
      number: "text-emerald-500",
      border: "hover:border-emerald-400/40",
      dot: "bg-emerald-400",
      line: "bg-emerald-400",
    },
    violet: {
      number: "text-violet-500",
      border: "hover:border-violet-400/40",
      dot: "bg-violet-400",
      line: "bg-violet-400",
    },
    rose: {
      number: "text-rose-500",
      border: "hover:border-rose-400/40",
      dot: "bg-rose-400",
      line: "bg-rose-400",
    },
  };

  const s = styles[color];

  return (
    <div
      className={`group relative overflow-hidden rounded-2xl border border-[var(--app-border)] bg-[var(--app-surface)] p-6 shadow-xl transition duration-500 hover:-translate-y-2 ${s.border}`}
    >
      <div className="relative">
        <div className="flex items-center justify-between">
          <span
            className={`text-sm font-bold ${s.number}`}
          >
            {number}
          </span>

          <span className="flex h-8 w-8 items-center justify-center rounded-full border border-[var(--app-border)] bg-[var(--app-bg-secondary)]">
            <span
              className={`h-2 w-2 rounded-full ${s.dot}`}
            />
          </span>
        </div>

        <h3 className="mt-9 text-xl font-semibold text-[var(--app-heading)]">
          {title}
        </h3>

        <p className="mt-3 text-sm leading-7 text-[var(--app-muted)]">
          {text}
        </p>

        <div
          className={`mt-7 h-px w-0 transition-all duration-500 group-hover:w-full ${s.line}`}
        />
      </div>
    </div>
  );
}

/* =========================================================
   FEATURE CARD
========================================================= */

function FeatureCard({
  number,
  title,
  text,
  color,
}: {
  number: string;
  title: string;
  text: string;
  color:
    | "rose"
    | "emerald"
    | "violet"
    | "amber";
}) {
  const colors = {
    rose:
      "text-rose-500 group-hover:border-rose-400/40",
    emerald:
      "text-emerald-500 group-hover:border-emerald-400/40",
    violet:
      "text-violet-500 group-hover:border-violet-400/40",
    amber:
      "text-amber-500 group-hover:border-amber-400/40",
  };

  return (
    <div
      className={`group rounded-2xl border border-[var(--app-border)] bg-[var(--app-surface)] p-5 shadow-sm transition duration-300 hover:-translate-y-1 ${colors[color]}`}
    >
      <div className="flex items-center justify-between">
        <span
          className={`text-xs font-bold ${
            colors[color].split(" ")[0]
          }`}
        >
          {number}
        </span>

        <span className="text-xs text-[var(--app-muted)] transition group-hover:text-[var(--app-heading)]">
          +
        </span>
      </div>

      <p className="mt-5 font-semibold text-[var(--app-heading)]">
        {title}
      </p>

      <p className="mt-2 text-sm leading-6 text-[var(--app-muted)]">
        {text}
      </p>
    </div>
  );
}

/* =========================================================
   ROLE CARD
========================================================= */

function RoleCard({
  title,
  description,
  href,
  action,
  icon,
  color,
}: {
  title: string;
  description: string;
  href: string;
  action: string;
  icon: string;
  color:
    | "emerald"
    | "cyan"
    | "violet";
}) {
  const styles = {
    emerald: {
      icon: "border-emerald-400/20 bg-emerald-400/10 text-emerald-500",
      button:
        "hover:border-emerald-400/40 hover:bg-emerald-400/10 hover:text-emerald-500",
      glow: "bg-emerald-400/[0.04]",
    },
    cyan: {
      icon: "border-cyan-400/20 bg-cyan-400/10 text-cyan-500",
      button:
        "hover:border-cyan-400/40 hover:bg-cyan-400/10 hover:text-cyan-500",
      glow: "bg-cyan-400/[0.04]",
    },
    violet: {
      icon: "border-violet-400/20 bg-violet-400/10 text-violet-500",
      button:
        "hover:border-violet-400/40 hover:bg-violet-400/10 hover:text-violet-500",
      glow: "bg-violet-400/[0.04]",
    },
  };

  const s = styles[color];

  return (
    <div className="group relative rounded-3xl border border-[var(--app-border)] bg-[var(--app-surface)] p-7 shadow-2xl transition duration-500 hover:-translate-y-3">
      <div
        className={`absolute right-[-50px] top-[-50px] h-40 w-40 rounded-full ${s.glow} blur-3xl`}
      />

      <div className="relative">
        <div
          className={`flex h-16 w-16 items-center justify-center rounded-2xl border font-bold shadow-inner ${s.icon}`}
        >
          {icon}
        </div>

        <h3 className="mt-7 text-2xl font-semibold text-[var(--app-heading)]">
          {title}
        </h3>

        <p className="mt-4 min-h-[84px] text-sm leading-7 text-[var(--app-muted)]">
          {description}
        </p>

        <Link
          href={href}
          className={`mt-8 flex items-center justify-center rounded-xl border border-[var(--app-border)] bg-[var(--app-bg-secondary)] px-5 py-3.5 text-sm font-semibold text-[var(--app-text)] transition duration-300 ${s.button}`}
        >
          {action}

          <span className="ml-2 transition-transform duration-300 group-hover:translate-x-1">
            →
          </span>
        </Link>
      </div>
    </div>
  );
}