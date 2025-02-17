import uvicorn

if __name__ == "__main__":
  """Start API server"""
  uvicorn.run("clothing_processor.main:app", host="0.0.0.0", port=8000, reload=True)