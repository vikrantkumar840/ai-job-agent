from fastapi import APIRouter, Depends

from database.postgres import get_db

from services.analytics_service import application_stats

router = APIRouter(
    prefix="/analytics",
    tags=["Analytics"],
)


@router.get("/{user_id}")
def analytics(
    user_id: int,
    db=Depends(get_db),
):

    return application_stats(
        db,
        user_id,
    )
