import re

# supported pollutants
POLLUTANTS = {
    "pm25": ["pm25", "pm2.5", "pm 2.5"],
    "pm10": ["pm10", "pm 10"],
    "no2": ["no2"],
    "so2": ["so2"],
    "o3": ["o3"],
    "co": ["co"],
    "nh3": ["nh3"],
}

def extract_year(text):
    match = re.search(r"\b(20[1-3]\d)\b", text)
    return int(match.group(1)) if match else None


def extract_pollutant(text):

    text = text.lower()

    # ---------- NORMALIZATION FIX ----------
    text = text.replace("pm2.5", "pm25")
    text = text.replace("pm 2.5", "pm25")
    text = text.replace("pm 25", "pm25")

    text = text.replace("pm 10", "pm10")

    # ---------- MATCH FROM DICTIONARY ----------
    for key, values in POLLUTANTS.items():
        for v in values:
            if v in text:
                return key

    return None


def extract_district(message, districts):

    msg = normalize_text(message)

    for d in districts:
        if d.lower() in msg:
            return d

    return None

def extract_state(text, states):

    text = text.lower()

    for s in states:
        if s in text:
            return s.title()   # match DB format

    return None

def detect_intent(text):
    text = text.lower()

    if "trend" in text or "change" in text:
        return "trend"

    if "compare" in text or "vs" in text:
        return "compare"

    if "average" in text or "avg" in text or "kitna" in text:
        return "average"

    return "average"


# -------- LEVEL 2 INTENT ROUTER --------

def detect_advanced_intent(text):

    text = text.lower()

    scores = {
        "year_compare": 0,
        "district_compare": 0,
        "cleanest_district": 0,
        "trend": 0,
        "winter_trend": 0,
        "pollution_days": 0,
    }
    
    years = re.findall(r"(20\d{2})", text)
    if len(years) >= 2:
        scores["year_compare"] += 5
        
    if "compare" in text and len(years) >= 1:
        scores["year_compare"] += 3    

   
    # YEAR COMPARISON SIGNALS
    
    year_words = [
        "improve", "improved", "improvement",
        "better than", "change between",
        "year compare", "compare year",
        "improve hua", "better hui",
        "worse hua"
    ]

    for w in year_words:
        if w in text:
            scores["year_compare"] += 2


  
    # DISTRICT COMPARISON SIGNALS

    district_words = [
        "vs", "difference",
        "which better", "kaun better",
        "kaunsa better",
        "less polluted", "more polluted",
        "cleaner",
        "kaun kam polluted",
        "kaun jyada polluted",
    ]

    for w in district_words:
        if w in text:
            scores["district_compare"] += 2


    
    # CLEANEST DISTRICT SIGNALS
    
    clean_words = [
        "cleanest",
        "least polluted",
        "lowest pollution",
        "sabse clean",
        "sabse kam pollution",
        "best air",
        "top district"
    ]

    for w in clean_words:
        if w in text:
            scores["cleanest_district"] += 2


   
    # TREND SIGNALS
   
    trend_words = [
        "trend",
        "increase",
        "decrease",
        "rising",
        "falling"
    ]

    for w in trend_words:
        if w in text:
            scores["trend"] += 1


   
    # WINTER SCIENCE
    
    if "winter" in text or "sardi" in text:
        scores["winter_trend"] += 2


    
    # POLLUTION DAYS
    
    if "pollution days" in text or "severe days" in text:
        scores["pollution_days"] += 2


    
    # FINAL DECISION

    best_intent = max(scores, key=scores.get)

    if scores[best_intent] == 0:
        return None

    return best_intent

# -------- MULTI DISTRICT DETECTION --------

def extract_multiple_districts(text, districts):
    text = text.lower()
    found = []

    for d in districts:
        if d.lower() in text:
            found.append(d)

    return found if len(found) >= 2 else None


def normalize_text(text):
    return text.lower().replace("city", "").replace("district", "").strip()


def extract_district(message, districts):

    msg = normalize_text(message)

    for d in districts:
        if d.lower() in msg:
            return d

    return None

def extract_multiple_pollutants(msg):

    msg = msg.replace("pm2.5", "pm25")
    msg = msg.replace("pm 2.5", "pm25")
    msg = msg.replace("pm 25", "pm25")

    pollutants = []

    mapping = ["pm25", "pm10", "no2", "so2", "co", "o3", "nh3"]

    for p in mapping:
        if p in msg:
            pollutants.append(p)

    return pollutants

# date extraction

MONTH_MAP = {
    "jan":1,"january":1,
    "feb":2,"february":2,
    "mar":3,"march":3,
    "apr":4,"april":4,
    "may":5,
    "jun":6,"june":6,
    "jul":7,"july":7,
    "aug":8,"august":8,
    "sep":9,"september":9,
    "oct":10,"october":10,
    "nov":11,"november":11,
    "dec":12,"december":12,
}

def extract_date_parts(msg):

    day = None
    month = None

    # find day
    d = re.search(r'\b([0-9]{1,2})\b', msg)
    if d:
        day = int(d.group(1))

    # find month text
    for name, num in MONTH_MAP.items():
        if name in msg:
            month = num
            break

    return day, month


AQI_HEALTH_ADVICE = {
    "Good": "Air quality is satisfactory and poses little or no risk.",
    "Satisfactory": "Sensitive individuals may experience minor breathing discomfort.",
    "Moderate": "People with lung or heart disease may feel discomfort.",
    "Poor": "Breathing discomfort possible on prolonged exposure.",
    "Very Poor": "Respiratory illness risk increases on prolonged exposure.",
    "Severe": "Serious health impacts even for healthy people."
}
SCIENCE_EXPLANATIONS = {
    "winter": "Pollution increases in winter due to temperature inversion and low wind speed trapping pollutants.",
    "pm25": "PM2.5 particles are extremely small and can enter lungs and bloodstream causing health issues.",
    "reason": "Major pollution sources include vehicle emissions, dust, industries, and biomass burning."
}