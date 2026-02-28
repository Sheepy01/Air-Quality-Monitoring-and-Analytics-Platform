# CPCB AQI Breakpoints (Simplified)

BREAKPOINTS = {
    "pm25": [
        (0, 30, 0, 50),
        (31, 60, 51, 100),
        (61, 90, 101, 200),
        (91, 120, 201, 300),
        (121, 250, 301, 400),
        (251, 500, 401, 500),
    ],

    "pm10": [
        (0, 50, 0, 50),
        (51, 100, 51, 100),
        (101, 250, 101, 200),
        (251, 350, 201, 300),
        (351, 430, 301, 400),
        (431, 600, 401, 500),
    ],

    "no2": [
        (0, 40, 0, 50),
        (41, 80, 51, 100),
        (81, 180, 101, 200),
        (181, 280, 201, 300),
        (281, 400, 301, 400),
        (401, 1000, 401, 500),
    ],
}


# ---------- Sub Index Calculator ----------
def calculate_sub_index(cp, breakpoints):
    if cp is None:
        return None

    for bp_low, bp_high, i_low, i_high in breakpoints:
        if bp_low <= cp <= bp_high:
            return ((i_high - i_low) / (bp_high - bp_low)) * (cp - bp_low) + i_low

    return None


# ---------- Overall AQI Calculator ----------
def calculate_overall_aqi(record):

    sub_indices = {}

    for pollutant, ranges in BREAKPOINTS.items():
        value = getattr(record, pollutant, None)
        sub_aqi = calculate_sub_index(value, ranges)

        #  IMPORTANT FIX 
        if sub_aqi is not None:
            sub_indices[pollutant] = round(sub_aqi)

    # No valid pollutant data
    if not sub_indices:
        return None, "Unknown", None, None

    #  Worst pollutant decides AQI
    dominant_pollutant = max(sub_indices, key=sub_indices.get)
    final_aqi = sub_indices[dominant_pollutant]

    # ---------- AQI Category ----------
    if final_aqi <= 50:
        category = "Good"
        color = "Green"
    elif final_aqi <= 100:
        category = "Satisfactory"
        color = "LightGreen"
    elif final_aqi <= 200:
        category = "Moderate"
        color = "Yellow"
    elif final_aqi <= 300:
        category = "Poor"
        color = "Orange"
    elif final_aqi <= 400:
        category = "Very Poor"
        color = "Red"
    else:
        category = "Severe"
        color = "Maroon"

    #  returning dominant pollutant also
    return final_aqi, category, color, dominant_pollutant

def calculate_aqi_from_values(pm25=None, pm10=None, no2=None, so2=None, o3=None, co=None, nh3=None):

    class TempRecord:
        pass

    temp = TempRecord()
    temp.pm25 = pm25
    temp.pm10 = pm10
    temp.no2 = no2
    temp.so2 = so2
    temp.o3 = o3
    temp.co = co
    temp.nh3 = nh3

    return calculate_overall_aqi(temp)