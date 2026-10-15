from sentence_transformers import SentenceTransformer, util

encoder = SentenceTransformer("sentence-transformers/paraphrase-multilingual-MiniLM-L12-v2")


sentences = [
    "I feel so sad today",              
    "Ma nagyon szomorú vagyok",          
    "Өнөөдөр би их гунигтай байна",                      
]

numbers = encoder.encode(sentences)
print("Numbers per sentence:", len(numbers[0]))
print("The first 5 numbers of sentence 1:", numbers[0][:5])

for i in range(len(sentences)):
    similarity = util.cos_sim(numbers[0], numbers[i])
    print(sentences[i], "->", round(float(similarity), 2))
