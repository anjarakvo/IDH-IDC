from sqlalchemy.orm import Session
from typing import List

from models.question import Question, QuestionGroupParam, QuestionGroupListDict
from models.commodity import Commodity
from models.commodity_category_question import CommodityCategoryQuestion


def build_tree(data, parent=None):
    tree = []
    for item in data:
        if item["parent"] == parent:
            children = build_tree(data, item["id"])
            if children:
                item["childrens"] = children
            tree.append(item)
    return tree


def get_question_by_commodity(
    session: Session, params: List[QuestionGroupParam]
) -> List[QuestionGroupListDict]:
    res = []
    for param in params:
        commodity = (
            session.query(Commodity).filter(Commodity.id == param["commodity"]).first()
        )
        commodity = commodity.to_question_list
        commodity_category_id = commodity["commodity_category_id"]
        questions = (
            session.query(Question)
            .join(CommodityCategoryQuestion)
            .filter(
                CommodityCategoryQuestion.commodity_category == commodity_category_id,
            )
            .all()
        )
        questions = [question.serialize for question in questions]
        commodity["questions"] = build_tree(questions)
        res.append(commodity)
    return res
