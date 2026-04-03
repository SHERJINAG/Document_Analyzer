from collections import defaultdict
import os
import time
import logging
import requests
import pytesseract
import pdfplumber
from docx import Document as DocxDocument
from PIL import Image
import platform
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Read values from .env
HUGGINGFACE_API_KEY = os.getenv("HUGGINGFACE_API_KEY")
HEADERS = {"Authorization": f"Bearer {HUGGINGFACE_API_KEY}"}
MAX_TEXT_LENGTH = 20000

logging.basicConfig(
    filename="document_ai.log",
    level=logging.INFO,
    format="%(asctime)s - %(levelname)s - %(message)s"
)

# Path to Tesseract executable


pytesseract.pytesseract.tesseract_cmd = "/usr/bin/tesseract"

# =========================
# TEXT EXTRACTION
# =========================
def extract_text_from_pdf(file_path):
    text = ""
    try:
        with pdfplumber.open(file_path) as pdf:
            for page in pdf.pages:
                page_text = page.extract_text()
                if page_text:
                    text += page_text + "\n"
        logging.info(f"PDF extraction completed: {file_path}")
        print("HF KEY:", HUGGINGFACE_API_KEY)
        print("File exists:", os.path.exists(doc.file.path))
        print("Text length:", len(text))
    except Exception as e:
        logging.error(f"PDF extraction error: {e}")
    return text

def extract_text_from_docx(file_path):
    text = ""
    try:
        doc = DocxDocument(file_path)
        for para in doc.paragraphs:
            text += para.text + "\n"
        logging.info(f"DOCX extraction completed: {file_path}")
    except Exception as e:
        logging.error(f"DOCX extraction error: {e}")
    return text

def extract_text_from_image(file_path):
    try:
        image = Image.open(file_path)
        text = pytesseract.image_to_string(image)
        logging.info(f"Image OCR completed: {file_path}")
        return text
    except Exception as e:
        logging.error(f"Image OCR error: {e}")
        return ""

def extract_text(file_path):
    if file_path.lower().endswith(".pdf"):
        return extract_text_from_pdf(file_path)
    elif file_path.lower().endswith(".docx"):
        return extract_text_from_docx(file_path)
    else:
        return extract_text_from_image(file_path)

# =========================
# AI PROCESSING
# =========================
def summarize_text(text):
    if not text.strip():
        return ""
    url = "https://router.huggingface.co/hf-inference/models/facebook/bart-large-cnn"
    try:
        response = requests.post(url, headers=HEADERS, json={"inputs": text[:MAX_TEXT_LENGTH]}, timeout=60)
        result = response.json()
        if isinstance(result, list) and result and "summary_text" in result[0]:
            return result[0]["summary_text"]
    except Exception as e:
        logging.error(f"Summarization error: {e}")
    return ""






def clean_entity(word):
    """
    Clean individual entity strings:
    - remove extra spaces
    - remove repeated words (AI AI -> AI)
    - remove single letters or non-alphanumeric noise
    """
    # Remove extra spaces
    word = word.strip()
    # Split words and remove duplicates while preserving order
    tokens = word.split()
    seen = set()
    clean_tokens = []
    for t in tokens:
        t_clean = t.strip()
        if t_clean and t_clean.lower() not in seen and len(t_clean) > 1:
            clean_tokens.append(t_clean)
            seen.add(t_clean.lower())
    return " ".join(clean_tokens) if clean_tokens else None

def extract_entities_cleaned(text, max_chars=20000):
    """
    Extract named entities from text using Hugging Face NER (dynamic keys).
    Returns only non-empty, cleaned entities with duplicates removed.
    """
    entities = defaultdict(list)
    if not text.strip():
        return {}

    url = "https://router.huggingface.co/hf-inference/models/dbmdz/bert-large-cased-finetuned-conll03-english"

    try:
        response = requests.post(
            url,
            headers=HEADERS,
            json={"inputs": text[:max_chars]},
            timeout=60
        )

        if response.status_code != 200:
            logging.error(f"NER API returned {response.status_code}: {response.text}")
            return {}

        result = response.json()
        prev_label = None
        prev_word = ""

        for item in result:
           
            word = item.get("word", "").replace("##", "").strip()
            label = item.get("entity_group", "").lower()

            if not word or not label:
                continue

            # Merge consecutive tokens of the same entity
            if label == prev_label:
                prev_word += " " + word
            else:
                if prev_label and prev_word:
                    cleaned = clean_entity(prev_word)
                    if cleaned:
                        entities[prev_label].append(cleaned)
                prev_word = word
                prev_label = label

        # Add the last entity
        if prev_label and prev_word:
            cleaned = clean_entity(prev_word)
            if cleaned:
                entities[prev_label].append(cleaned)

        # Remove duplicates per key
        clean_entities = {k: list(dict.fromkeys(v)) for k, v in entities.items() if v}
        return clean_entities

    except Exception as e:
        logging.error(f"Entity extraction failed: {e}")
        return {}


def analyze_sentiment(text):

    API_URL = (
        "https://router.huggingface.co/hf-inference/models/"
        "cardiffnlp/twitter-roberta-base-sentiment-latest"
    )

    try:

        if not text or not text.strip():
            return "NEUTRAL"

        text = text[:2000]

        response = requests.post(
            API_URL,
            headers=HEADERS,
            json={
                "inputs": text
            },
            timeout=60
        )

        if response.status_code != 200:

            print("Sentiment API error:", response.text)
            return "NEUTRAL"

        result = response.json()

        

        # Handle nested list structure
        if isinstance(result, list):

            if len(result) == 0:
                return "NEUTRAL"

            # Case 1: [[{label, score}]]
            if isinstance(result[0], list):

                label = result[0][0]["label"]
                score = result[0][0]["score"]

            # Case 2: [{label, score}]
            else:

                label = result[0]["label"]
                score = result[0]["score"]

            # Confidence threshold
            if score < 0.60:
                return "NEUTRAL"

            # Normalize labels
            label = label.upper()

            if label in ["LABEL_2", "POSITIVE"]:
                return "POSITIVE"

            if label in ["LABEL_0", "NEGATIVE"]:
                return "NEGATIVE"

            return "NEUTRAL"

        return "NEUTRAL"

    except Exception as e:

        print("Sentiment exception:", e)
        return "NEUTRAL"


# =========================
# MAIN PROCESS
# =========================
def process_document(file_path):
    start_time = time.time()
    if not os.path.exists(file_path):
        return {"status": "error", "message": "File not found"}

    text = extract_text(file_path)
    logging.info(f"DEBUG EXTRACTED TEXT: {repr(text)}")

    if not text.strip():
        return {"status": "error", "message": "No text extracted"}

    summary = summarize_text(text)
    entities = extract_entities_cleaned(text)
    sentiment = analyze_sentiment(text)
    processing_time = round(time.time() - start_time, 2)

    return {
        "status": "success",
        "file_name": os.path.basename(file_path),
        "text_length": len(text),
        "summary": summary,
        "entities": entities,
        "sentiment": sentiment,
        "processing_time_seconds": processing_time
    }

