import platform
from datetime import datetime
from typing import Annotated

import psutil
from GPUtil import GPUtil
from fastapi import Depends, APIRouter

from baznimodeli import ItemOperater
from ruteri.login_ruter import get_current_active_user

router = APIRouter()


@router.get("/operater/ja/", response_model=ItemOperater)
async def citaj_operater_ja(
    current_user: Annotated[ItemOperater, Depends(get_current_active_user)]
):
    return current_user


@router.get("/operater/ja/items/")
async def citaj_moje_ajteme(
    current_user: Annotated[ItemOperater, Depends(get_current_active_user)]
):
    return [{"item_id": "Mujo", "vlasnik": current_user.email}]

