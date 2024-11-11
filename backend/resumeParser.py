# # backend/resumeParser.py
# import sys
# import spacy
# import json

# nlp = spacy.load("en_core_web_sm")

# def parse_resume(text):
#     doc = nlp(text)

#     # Placeholder for extracted data
#     data = {
#         "name": "",
#         "email": "",
#         "phone": "",
#         "location": "",
#         "skills": [],
#         "experience": "",
#         "education": "",
#         "job_title": ""
#     }

#     for ent in doc.ents:
#         if ent.label_ == "PERSON":
#             data["name"] = ent.text
#         elif ent.label_ == "GPE":
#             data["location"] = ent.text
#         # Add extraction logic for other fields

#     return data

# if __name__ == "__main__":
#     resume_text = sys.argv[1]
#     parsed_data = parse_resume(resume_text)
#     print(json.dumps(parsed_data))
