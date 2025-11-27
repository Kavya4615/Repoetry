# ai_module/analyzer.py
def analyze_telugu_poem(text):
    # split into lines
    lines = [l.strip() for l in text.splitlines() if l.strip()]
    # simplistic syllable/matra counting placeholder
    metrics = [count_matras(line) for line in lines]
    rhymes = detect_rhyme_scheme(lines)
    return {"lines": lines, "metrics": metrics, "rhyme_scheme": rhymes}