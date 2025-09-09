import os
import tempfile
import pdfplumber
from fastapi import FastAPI, UploadFile, File, Form
from fastapi.middleware.cors import CORSMiddleware
from transformers import pipeline

classifier = pipeline("zero-shot-classification", model="facebook/bart-base")
responder = pipeline("text2text-generation", model="google/flan-t5-small")

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

def classify_and_respond(email_text: str):
    result = classifier(
        email_text,
        candidate_labels=["produtivo", "improdutivo"]
    )
    categoria = result["labels"][0]

    prompt = f"Email classificado como {categoria}. Escreva uma resposta educada em português:\n{email_text}"
    resposta = responder(prompt, max_length=300, min_length=50, num_return_sequences=1, temperature=0.7)[0]["generated_text"]

    return {"conteudo": email_text,"categoria": categoria, "resposta_sugerida": resposta}

def extract_text_from_pdf(path: str) -> str:
    text = ""
    with pdfplumber.open(path) as pdf:
        for page in pdf.pages:
            if page.extract_text():
                text += page.extract_text() + "\n"
    return text.strip()

@app.post("/classify-text")
async def classify_text(text: str = Form(...)):
    try:
        resultado = classify_and_respond(text)  # A função continua igual
        return resultado
    except Exception as e:
        import traceback
        traceback.print_exc()
        return {"error": str(e)}

@app.post("/upload")
async def upload_file(file: UploadFile = File(...)):
    try:
        with tempfile.NamedTemporaryFile(delete=False) as tmp:
            tmp.write(await file.read())
            tmp_path = tmp.name

        text = extract_text_from_pdf(tmp_path)
        return classify_and_respond(text)

    except Exception as e:
        import traceback
        traceback.print_exc()
        return {"error": str(e)}
