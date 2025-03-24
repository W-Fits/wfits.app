import uvicorn

if __name__ == "__main__":
  """Start API server"""
  uvicorn.run("outfit_gen.main:app", host="0.0.0.0", port=4000, reload=True)