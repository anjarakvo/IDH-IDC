from sqlalchemy.orm import Session
from typing import List

from models.question import (
    QuestionGroupParam, QuestionGroupListDict
)
from models.crop import Crop


def get_question_by_crop(
    session: Session, params: List[QuestionGroupParam]
) -> List[QuestionGroupListDict]:
    res = []
    for param in params:
        crop = session.query(Crop).filter(Crop.id == param["crop"]).first()
        crop = crop.to_question_list
        questions = crop["questions"]
        if param["breakdown"]:
            crop["questions"] = [q.serialize_with_child for q in questions]
        else:
            crop["questions"] = [q.serialize for q in questions]
        res.append(crop)
    return res
