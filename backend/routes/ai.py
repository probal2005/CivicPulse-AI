from typing import Optional

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, Field

from services.ai_service import chat_with_ai


router = APIRouter(
    prefix="/api/ai",
    tags=["AI"],
)


class ChatMessage(BaseModel):
    role: str
    content: str


class ChatRequest(BaseModel):
    message: str = Field(
        min_length=1,
        max_length=4000,
    )

    history: Optional[list[ChatMessage]] = None


class ChatResponse(BaseModel):
    success: bool
    message: str


@router.post("/chat", response_model=ChatResponse)
async def chat(request: ChatRequest):

    try:

        history = []

        if request.history:
            history = [
                {
                    "role": item.role,
                    "content": item.content,
                }
                for item in request.history
            ]

        answer = await chat_with_ai(
            message=request.message,
            history=history,
        )

        return ChatResponse(
            success=True,
            message=answer,
        )

    except Exception as error:

        print("AI ERROR:", repr(error))

        raise HTTPException(
            status_code=500,
            detail="AI service temporarily unavailable.",
        )