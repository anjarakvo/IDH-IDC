from sqlalchemy.orm import Session
from typing import List

from models.question import (
    QuestionGroupParam, QuestionGroupListDict
)
from models.commodity import Commodity


def get_question_by_commodity(
    session: Session, params: List[QuestionGroupParam]
) -> List[QuestionGroupListDict]:
    res = []
    for param in params:
        commodity = session.query(Commodity).filter(Commodity.id == param["commodity"]).first()
        commodity = commodity.to_question_list
        questions = commodity["questions"]
        if param["breakdown"]:
            questions = [q for q in questions if not q.parent]
            commodity["questions"] = [q.serialize_with_child for q in questions]
        else:
            commodity["questions"] = [q.serialize for q in questions]
        res.append(commodity)
    return res
