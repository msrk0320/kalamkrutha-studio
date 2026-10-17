"""Build te/index.html and hi/index.html from the English index.html.

Edit the English page, then run:  python i18n/build.py
Every English string below must still exist in index.html, or the build stops
and names the missing one, so the translations never silently drift.
"""
from pathlib import Path
from urllib.parse import quote

ROOT = Path(__file__).resolve().parent.parent
WA = "https://wa.me/918885858111?text="

EN_WA = {
    "general": "Hi%20Kalamkrutha%20Studio%2C%20I%27d%20like%20to%20enquire%20about%20a%20shoot.",
    "date": "Hi%20Kalamkrutha%20Studio%2C%20I%27d%20like%20to%20check%20availability%20for%20my%20wedding%20date.",
    "package": "Hi%2C%20please%20share%20your%20wedding%20package%20details.",
}

FONTS_EN = "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=Noto+Sans+Telugu:wght@500&family=Playfair+Display:ital,wght@0,500;0,600;1,500&display=swap"
FONTS = {
    "te": "https://fonts.googleapis.com/css2?family=Noto+Sans+Telugu:wght@400;500;600&family=Noto+Serif+Telugu:wght@500;600&family=Playfair+Display:wght@500&display=swap",
    "hi": "https://fonts.googleapis.com/css2?family=Noto+Sans+Devanagari:wght@400;500;600&family=Noto+Sans+Telugu:wght@500&family=Noto+Serif+Devanagari:wght@500;600&family=Playfair+Display:wght@500&display=swap",
}

# (English, Telugu, Hindi). Strings include surrounding markup so short words
# like "Wedding" only match where intended. Each pair is replaced everywhere.
T = [
    ("<title>Kalamkrutha Digital Studio | Wedding Photography &amp; Video in Guntur</title>",
     "<title>కలంకృత డిజిటల్ స్టూడియో | గుంటూరులో వెడ్డింగ్ ఫోటోగ్రఫీ &amp; వీడియో</title>",
     "<title>कलमकृत डिजिटल स्टूडियो | गुंटूर में वेडिंग फोटोग्राफी और वीडियो</title>"),
    ('content="Kalamkrutha Digital Studio, Old Guntur. Wedding, pre-wedding, church wedding, half-saree, birthday and newborn photography, HD video, video editing and album making since 2016. Instant passport photos and colour xerox."',
     'content="కలంకృత డిజిటల్ స్టూడియో, పాత గుంటూరు. 2016 నుండి పెళ్లి, ప్రీ-వెడ్డింగ్, చర్చి వివాహం, లంగా ఓణీ ఫంక్షన్, పుట్టినరోజు, నవజాత శిశువు ఫోటోగ్రఫీ, HD వీడియో, వీడియో ఎడిటింగ్ మరియు ఆల్బమ్ తయారీ. అర్జెంట్ పాస్‌పోర్ట్ ఫోటోలు, కలర్ జిరాక్స్."',
     'content="कलमकृत डिजिटल स्टूडियो, पुराना गुंटूर। 2016 से शादी, प्री-वेडिंग, चर्च वेडिंग, हाफ-साड़ी फंक्शन, जन्मदिन और नवजात शिशु फोटोग्राफी, HD वीडियो, वीडियो एडिटिंग और एल्बम मेकिंग। तुरंत पासपोर्ट फोटो और कलर ज़ेरॉक्स।"'),
    ('<meta property="og:title" content="Kalamkrutha Digital Studio, Guntur">',
     '<meta property="og:title" content="కలంకృత డిజిటల్ స్టూడియో, గుంటూరు">',
     '<meta property="og:title" content="कलमकृत डिजिटल स्टूडियो, गुंटूर">'),
    ('<meta property="og:description" content="Wedding photography and cinematic video in Guntur since 2016.">',
     '<meta property="og:description" content="2016 నుండి గుంటూరులో పెళ్లి ఫోటోగ్రఫీ మరియు సినిమాటిక్ వీడియో.">',
     '<meta property="og:description" content="2016 से गुंटूर में वेडिंग फोटोग्राफी और सिनेमैटिक वीडियो।">'),

    # Header
    ('>Skip to content<', '>కంటెంట్‌కు వెళ్ళండి<', '>मुख्य सामग्री पर जाएँ<'),
    ('aria-label="Kalamkrutha Digital Studio, home"', 'aria-label="కలంకృత డిజిటల్ స్టూడియో, హోమ్"', 'aria-label="कलमकृत डिजिटल स्टूडियो, होम"'),
    ('<nav class="nav" aria-label="Main">', '<nav class="nav" aria-label="ప్రధాన మెను">', '<nav class="nav" aria-label="मुख्य मेनू">'),
    ('<nav class="lang" aria-label="Language">', '<nav class="lang" aria-label="భాష">', '<nav class="lang" aria-label="भाषा">'),
    ('<a href="#services">Services</a>', '<a href="#services">సేవలు</a>', '<a href="#services">सेवाएँ</a>'),
    ('<a href="#work">Work</a>', '<a href="#work">మా పని</a>', '<a href="#work">हमारा काम</a>'),
    ('<a href="#packages">Packages</a>', '<a href="#packages">ప్యాకేజీలు</a>', '<a href="#packages">पैकेज</a>'),
    ('<a href="#visit">Visit</a>', '<a href="#visit">చిరునామా</a>', '<a href="#visit">पता</a>'),

    # Hero
    ('alt="Telugu bride in a red and gold pattu saree with jasmine in her hair, looking toward window light"',
     'alt="జడలో మల్లెపూలతో ఎరుపు-బంగారు పట్టుచీరలో తెలుగు పెళ్లికూతురు, కిటికీ వెలుగు వైపు చూస్తూ"',
     'alt="लाल-सुनहरी पट्टू साड़ी और बालों में चमेली के फूलों के साथ तेलुगु दुल्हन, खिड़की की रोशनी की ओर देखती हुई"'),
    ('>Old Guntur · Since 2016<', '>పాత గుంటూరు · 2016 నుండి<', '>पुराना गुंटूर · 2016 से<'),
    ('>Your wedding, <em>remembered</em> the way it felt.<',
     '>మీ పెళ్లి క్షణాలు, <em>ఎప్పటికీ</em> అదే అనుభూతితో.<',
     '>आपकी शादी के पल, <em>हमेशा</em> उसी एहसास के साथ।<'),
    ('>Wedding photography, candid shots and cinematic HD video for Telugu weddings, church weddings and every family function.<',
     '>తెలుగు పెళ్లిళ్లు, చర్చి వివాహాలు మరియు ప్రతి కుటుంబ వేడుకకు వెడ్డింగ్ ఫోటోగ్రఫీ, క్యాండిడ్ ఫోటోలు మరియు సినిమాటిక్ HD వీడియో.<',
     '>तेलुगु शादियों, चर्च वेडिंग और हर पारिवारिक समारोह के लिए वेडिंग फोटोग्राफी, कैंडिड शॉट्स और सिनेमैटिक HD वीडियो।<'),
    ('Check your date on WhatsApp', 'WhatsAppలో మీ తేదీ చెక్ చేయండి', 'WhatsApp पर अपनी तारीख़ पूछें'),
    ('>See our work<', '>మా పని చూడండి<', '>हमारा काम देखें<'),

    # Services
    ('>What we shoot<', '>మేము తీసేవి<', '>हम क्या शूट करते हैं<'),
    ('>Every chapter of the family album<', '>కుటుంబ ఆల్బమ్‌లోని ప్రతి అధ్యాయం<', '>पारिवारिक एल्बम का हर अध्याय<'),
    ('<h3>Weddings</h3>', '<h3>పెళ్లిళ్లు</h3>', '<h3>शादियाँ</h3>'),
    ('>Traditional and candid photography for Hindu and Christian weddings, from muhurtham to reception.<',
     '>హిందూ మరియు క్రైస్తవ వివాహాలకు ముహూర్తం నుండి రిసెప్షన్ వరకు సాంప్రదాయ మరియు క్యాండిడ్ ఫోటోగ్రఫీ.<',
     '>हिंदू और ईसाई शादियों के लिए मुहूर्त से रिसेप्शन तक पारंपरिक और कैंडिड फोटोग्राफी।<'),
    ('<h3>Cinematic video</h3>', '<h3>సినిమాటిక్ వీడియో</h3>', '<h3>सिनेमैटिक वीडियो</h3>'),
    ('>HD traditional videography and cinematic wedding films, edited into a story you will rewatch.<',
     '>HD సాంప్రదాయ వీడియోగ్రఫీ మరియు సినిమాటిక్ వెడ్డింగ్ ఫిల్మ్‌లు, మళ్లీ మళ్లీ చూడాలనిపించే కథగా ఎడిట్ చేసి.<',
     '>HD पारंपरिक वीडियोग्राफी और सिनेमैटिक वेडिंग फ़िल्में, ऐसी कहानी में एडिट की हुई जिसे आप बार-बार देखेंगे।<'),
    ('<h3>Pre &amp; post wedding</h3>', '<h3>ప్రీ &amp; పోస్ట్ వెడ్డింగ్</h3>', '<h3>प्री और पोस्ट वेडिंग</h3>'),
    ('>Outdoor couple shoots at locations around Guntur.<',
     '>గుంటూరు చుట్టుపక్కల లొకేషన్లలో అవుట్‌డోర్ కపుల్ షూట్స్.<',
     '>गुंटूर के आसपास की लोकेशनों पर आउटडोर कपल शूट।<'),
    ('<h3>Functions</h3>', '<h3>ఫంక్షన్లు</h3>', '<h3>फंक्शन</h3>'),
    ('>Engagements, half-saree functions, birthdays, house-warmings and family events.<',
     '>నిశ్చితార్థాలు, లంగా ఓణీ ఫంక్షన్లు, పుట్టినరోజులు, గృహప్రవేశాలు మరియు కుటుంబ వేడుకలు.<',
     '>सगाई, हाफ-साड़ी फंक्शन, जन्मदिन, गृहप्रवेश और पारिवारिक कार्यक्रम।<'),
    ('<h3>Newborn &amp; baby</h3>', '<h3>నవజాత శిశువు &amp; బేబీ</h3>', '<h3>नवजात और बेबी</h3>'),
    ('>Gentle newborn and baby portraits in the studio.<',
     '>స్టూడియోలో సున్నితమైన నవజాత శిశువు మరియు బేబీ ఫోటోలు.<',
     '>स्टूडियो में नवजात शिशु और बच्चों की कोमल तस्वीरें।<'),
    ('<h3>Editing &amp; albums</h3>', '<h3>ఎడిటింగ్ &amp; ఆల్బమ్స్</h3>', '<h3>एडिटिंग और एल्बम</h3>'),
    ('>Full-function videos that cover the whole ceremony, candid highlight videos that tell the whole event in 3–5 minutes, plus album design and album making.<',
     '>మొత్తం ఫంక్షన్‌ను కవర్ చేసే పూర్తి వీడియో, మొత్తం వేడుకను 3–5 నిమిషాల్లో చూపించే క్యాండిడ్ హైలైట్ వీడియో, ఆల్బమ్ డిజైన్ మరియు ఆల్బమ్ తయారీ.<',
     '>पूरे फंक्शन को कवर करने वाला फुल वीडियो, पूरे कार्यक्रम को 3–5 मिनट में दिखाने वाला कैंडिड हाइलाइट वीडियो, साथ में एल्बम डिज़ाइन और एल्बम मेकिंग।<'),
    ('aria-label="Walk-in services"', 'aria-label="వాక్-ఇన్ సేవలు"', 'aria-label="वॉक-इन सेवाएँ"'),
    ('<h3>Walk-in, same day</h3>', '<h3>నేరుగా రండి, అదే రోజు</h3>', '<h3>सीधे आइए, उसी दिन</h3>'),
    ('>Urgent passport photos, mobile photo prints, photostat and colour xerox.<',
     '>అర్జెంట్ పాస్‌పోర్ట్ ఫోటోలు, మొబైల్ ఫోటో ప్రింట్లు, ఫోటోస్టాట్ మరియు కలర్ జిరాక్స్.<',
     '>तुरंत पासपोर्ट फोटो, मोबाइल फोटो प्रिंट, फोटोस्टेट और कलर ज़ेरॉक्स।<'),
    ('>Call 88858 58111<', '>కాల్ చేయండి 88858 58111<', '>कॉल करें 88858 58111<'),

    # Portfolio
    ('>Portfolio<', '>పోర్ట్‌ఫోలియో<', '>पोर्टफ़ोलियो<'),
    ('>Moments we have kept<', '>మేము భద్రపరిచిన క్షణాలు<', '>हमारे सहेजे हुए पल<'),
    ('alt="Bride and groom laughing during the talambralu ritual under a flower mandapam"',
     'alt="పూల మండపం కింద తలంబ్రాలు పోసుకుంటూ నవ్వుతున్న వధూవరులు"',
     'alt="फूलों के मंडप के नीचे तलंब्रालु रस्म के दौरान हँसते हुए दूल्हा-दुल्हन"'),
    ('alt="Couple walking hand in hand through green paddy fields at golden hour"',
     'alt="సాయంత్రం బంగారు వెలుగులో పచ్చని వరి పొలాల్లో చేయి చేయి పట్టుకుని నడుస్తున్న జంట"',
     'alt="सुनहरी शाम में हरे धान के खेतों से हाथ में हाथ डाले गुज़रता जोड़ा"'),
    ('alt="Bride in a white silk saree and groom in a navy suit, both wearing garlands, in a church aisle"',
     'alt="చర్చిలో దండలు వేసుకున్న తెల్ల పట్టుచీరలో వధువు, నేవీ సూట్‌లో వరుడు"',
     'alt="चर्च के गलियारे में माला पहने सफ़ेद रेशमी साड़ी में दुल्हन और नेवी सूट में दूल्हा"'),
    ('alt="Girl in a green and pink langa voni at her half-saree function"',
     'alt="లంగా ఓణీ ఫంక్షన్‌లో ఆకుపచ్చ-గులాబీ లంగా ఓణీలో అమ్మాయి"',
     'alt="हाफ-साड़ी फंक्शन में हरे-गुलाबी लंगा वोणी में लड़की"'),
    ('alt="Newborn baby asleep wrapped in cream cloth, wearing a tiny gold bangle"',
     'alt="చిన్న బంగారు గాజుతో క్రీమ్ వస్త్రంలో చుట్టి నిద్రపోతున్న నవజాత శిశువు"',
     'alt="क्रीम कपड़े में लिपटा, छोटा सोने का कंगन पहने सोता हुआ नवजात"'),
    ('alt="Toddler in traditional silk clothes with parents at a first birthday cake table"',
     'alt="మొదటి పుట్టినరోజు కేక్ టేబుల్ వద్ద తల్లిదండ్రులతో పట్టు బట్టల్లో చిన్నారి"',
     'alt="पहले जन्मदिन पर केक टेबल के पास माता-पिता के साथ रेशमी कपड़ों में बच्चा"'),
    ('<figcaption>Talambralu</figcaption>', '<figcaption>తలంబ్రాలు</figcaption>', '<figcaption>तलंब्रालु</figcaption>'),
    ('<figcaption>Pre-wedding</figcaption>', '<figcaption>ప్రీ-వెడ్డింగ్</figcaption>', '<figcaption>प्री-वेडिंग</figcaption>'),
    ('<figcaption>Church wedding</figcaption>', '<figcaption>చర్చి వివాహం</figcaption>', '<figcaption>चर्च वेडिंग</figcaption>'),
    ('<figcaption>Half-saree function</figcaption>', '<figcaption>లంగా ఓణీ ఫంక్షన్</figcaption>', '<figcaption>हाफ-साड़ी फंक्शन</figcaption>'),
    ('<figcaption>Newborn</figcaption>', '<figcaption>నవజాత శిశువు</figcaption>', '<figcaption>नवजात</figcaption>'),
    ('<figcaption>First birthday</figcaption>', '<figcaption>మొదటి పుట్టినరోజు</figcaption>', '<figcaption>पहला जन्मदिन</figcaption>'),

    # Packages
    ('<p class="eyebrow">Packages</p>', '<p class="eyebrow">ప్యాకేజీలు</p>', '<p class="eyebrow">पैकेज</p>'),
    ('>Clear prices, no surprises<', '>స్పష్టమైన ధరలు, దాచిన ఖర్చులు లేవు<', '>साफ़ कीमतें, कोई छिपा खर्च नहीं<'),
    ('>Starting prices. Final quote depends on hours, video, albums and travel. Ask on WhatsApp and we will reply with a full breakdown.<',
     '>ఇవి ప్రారంభ ధరలు. తుది ధర గంటలు, వీడియో, ఆల్బమ్‌లు మరియు ప్రయాణంపై ఆధారపడి ఉంటుంది. WhatsAppలో అడగండి, పూర్తి వివరాలతో జవాబిస్తాం.<',
     '>ये शुरुआती कीमतें हैं। अंतिम कीमत घंटों, वीडियो, एल्बम और यात्रा पर निर्भर करती है। WhatsApp पर पूछें, हम पूरा ब्यौरा भेजेंगे।<'),
    ('<span>from</span>', '<span>ప్రారంభం</span>', '<span>शुरुआत</span>'),
    ('<h3>Birthday</h3>', '<h3>పుట్టినరోజు</h3>', '<h3>जन्मदिन</h3>'),
    ('<li>Posed and candid photos</li>', '<li>పోజ్డ్ మరియు క్యాండిడ్ ఫోటోలు</li>', '<li>पोज़्ड और कैंडिड फोटो</li>'),
    ('<li>Edited high-resolution images</li>', '<li>ఎడిట్ చేసిన హై-రిజల్యూషన్ ఫోటోలు</li>', '<li>एडिट की हुई हाई-रिज़ॉल्यूशन तस्वीरें</li>'),
    ('<li>Prints and album options</li>', '<li>ప్రింట్లు మరియు ఆల్బమ్ ఎంపికలు</li>', '<li>प्रिंट और एल्बम के विकल्प</li>'),
    ('<p class="tag">Signature</p>', '<p class="tag">ప్రత్యేకం</p>', '<p class="tag">ख़ास</p>'),
    ('<h3>Wedding</h3>', '<h3>పెళ్లి</h3>', '<h3>शादी</h3>'),
    ('<li>Traditional and candid coverage</li>', '<li>సాంప్రదాయ మరియు క్యాండిడ్ కవరేజ్</li>', '<li>पारंपरिक और कैंडिड कवरेज</li>'),
    ('<li>HD video add-on available</li>', '<li>HD వీడియో అదనంగా అందుబాటులో ఉంది</li>', '<li>HD वीडियो अलग से उपलब्ध</li>'),
    ('<li>Edited images and album design</li>', '<li>ఎడిట్ చేసిన ఫోటోలు మరియు ఆల్బమ్ డిజైన్</li>', '<li>एडिट की हुई तस्वीरें और एल्बम डिज़ाइन</li>'),
    ('>Get the wedding quote<', '>పెళ్లి కొటేషన్ పొందండి<', '>शादी का कोटेशन पाएँ<'),
    ('<h3>Engagement</h3>', '<h3>నిశ్చితార్థం</h3>', '<h3>सगाई</h3>'),
    ('<li>Ceremony coverage</li>', '<li>వేడుక కవరేజ్</li>', '<li>समारोह कवरेज</li>'),
    ('<li>Couple portraits</li>', '<li>జంట ఫోటోలు</li>', '<li>कपल पोर्ट्रेट</li>'),

    # About
    ('>About the studio<', '>స్టూడియో గురించి<', '>स्टूडियो के बारे में<'),
    ('>A neighbourhood studio in Old Guntur, since 2016<',
     '>పాత గుంటూరులో మీ దగ్గరి స్టూడియో, 2016 నుండి<',
     '>पुराने गुंटूर का अपना मोहल्ले का स्टूडियो, 2016 से<'),
    ('>Kalamkrutha Digital Studio has been open since 2016 on 3/1 Line, Sitaram Nagar, opposite Bharath Gas. We cover weddings, engagements and family functions with photography and HD video, and the studio is open daily for walk-in passport photos, prints and xerox. We photograph both Hindu and Christian ceremonies.<',
     '>కలంకృత డిజిటల్ స్టూడియో 2016 నుండి సీతారామ నగర్ 3/1వ లైన్‌లో, భారత్ గ్యాస్ ఎదురుగా ఉంది. పెళ్లిళ్లు, నిశ్చితార్థాలు మరియు కుటుంబ వేడుకలకు ఫోటోగ్రఫీ మరియు HD వీడియో అందిస్తాం. పాస్‌పోర్ట్ ఫోటోలు, ప్రింట్లు మరియు జిరాక్స్ కోసం స్టూడియో ప్రతిరోజూ తెరిచి ఉంటుంది. హిందూ మరియు క్రైస్తవ వేడుకలు రెండింటినీ మేము చిత్రీకరిస్తాం.<',
     '>कलमकृत डिजिटल स्टूडियो 2016 से सीताराम नगर की 3/1 लाइन पर, भारत गैस के सामने है। हम शादियों, सगाई और पारिवारिक समारोहों के लिए फोटोग्राफी और HD वीडियो करते हैं, और पासपोर्ट फोटो, प्रिंट और ज़ेरॉक्स के लिए स्टूडियो रोज़ खुला रहता है। हम हिंदू और ईसाई दोनों समारोहों की फोटोग्राफी करते हैं।<'),

    # Visit
    ('>Visit or call<', '>రండి లేదా కాల్ చేయండి<', '>आइए या कॉल करें<'),
    ('>Come see us<', '>మమ్మల్ని కలవండి<', '>हमसे मिलिए<'),
    ('<dt>Address</dt>', '<dt>చిరునామా</dt>', '<dt>पता</dt>'),
    ('<dt>Hours</dt>', '<dt>సమయం</dt>', '<dt>समय</dt>'),
    ('<dt>Phone</dt>', '<dt>ఫోన్</dt>', '<dt>फ़ोन</dt>'),
    ('<dt>Email</dt>', '<dt>ఈమెయిల్</dt>', '<dt>ईमेल</dt>'),
    ('<dd>Opp Bharath Gas, 3/1 Line, Sitaram Nagar-Old, Guntur 522001</dd>',
     '<dd>భారత్ గ్యాస్ ఎదురుగా, 3/1వ లైన్, సీతారామ నగర్ (పాత), గుంటూరు 522001</dd>',
     '<dd>भारत गैस के सामने, 3/1 लाइन, सीताराम नगर (पुराना), गुंटूर 522001</dd>'),
    ('<dd>Every day, 9:00 am – 9:00 pm</dd>', '<dd>ప్రతిరోజూ, ఉదయం 9:00 – రాత్రి 9:00</dd>', '<dd>रोज़, सुबह 9:00 – रात 9:00</dd>'),
    ('WhatsApp us', 'WhatsAppలో సంప్రదించండి', 'WhatsApp करें'),
    ('>Get directions<', '>దారి తెలుసుకోండి<', '>रास्ता देखें<'),
    ('title="Map to Kalamkrutha Digital Studio"', 'title="కలంకృత డిజిటల్ స్టూడియో మ్యాప్"', 'title="कलमकृत डिजिटल स्टूडियो का नक्शा"'),

    # Footer and mobile bar
    ('</span> Kalamkrutha Digital Studio, Guntur</p>', '</span> డిజిటల్ స్టూడియో, గుంటూరు</p>', '</span> कलमकृत डिजिटल स्टूडियो, गुंटूर</p>'),
    ('aria-label="Quick contact"', 'aria-label="త్వరిత సంప్రదింపు"', 'aria-label="तुरंत संपर्क"'),
    ('</svg>\n      Call\n    </a>', '</svg>\n      కాల్\n    </a>', '</svg>\n      कॉल\n    </a>'),
]

WA_TEXT = {
    "te": {
        "general": "నమస్కారం కలంకృత స్టూడియో, ఫోటోషూట్ గురించి వివరాలు కావాలి.",
        "date": "నమస్కారం కలంకృత స్టూడియో, మా పెళ్లి తేదీకి మీరు అందుబాటులో ఉన్నారో తెలుసుకోవాలి.",
        "package": "నమస్కారం, దయచేసి మీ పెళ్లి ప్యాకేజీ వివరాలు పంపండి.",
    },
    "hi": {
        "general": "नमस्ते कलमकृत स्टूडियो, फोटोशूट के बारे में जानकारी चाहिए।",
        "date": "नमस्ते कलमकृत स्टूडियो, हमें अपनी शादी की तारीख़ के लिए आपकी उपलब्धता जाननी है।",
        "package": "नमस्ते, कृपया अपने वेडिंग पैकेज की जानकारी भेजें।",
    },
}


def replace(s, old, new, label):
    if old not in s:
        raise SystemExit(f"[{label}] English string not found in index.html:\n  {old[:90]}")
    return s.replace(old, new)


def build(lang, col):
    s = (ROOT / "index.html").read_text(encoding="utf-8")
    for row in T:
        s = replace(s, row[0], row[col], lang)
    for key, en in EN_WA.items():
        s = replace(s, WA + en, WA + quote(WA_TEXT[lang][key]), lang)

    s = replace(s, '<html lang="en">', f'<html lang="{lang}">', lang)
    s = replace(s, FONTS_EN, FONTS[lang], lang)
    s = replace(s, 'href="styles.css"', 'href="../styles.css"', lang)
    s = replace(s, 'src="main.js"', 'src="../main.js"', lang)
    s = replace(s, '"assets/img/', '"../assets/img/', lang)
    s = replace(s, '<a href="/" lang="en" aria-current="page">EN</a>', '<a href="/" lang="en" hreflang="en">EN</a>', lang)
    s = replace(s, f'<a href="/{lang}/" lang="{lang}" hreflang="{lang}">', f'<a href="/{lang}/" lang="{lang}" aria-current="page">', lang)

    out = ROOT / lang / "index.html"
    out.parent.mkdir(exist_ok=True)
    out.write_text(s, encoding="utf-8")
    print(f"wrote {out.relative_to(ROOT)}")


build("te", 1)
build("hi", 2)
