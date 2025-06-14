import { ROUTES, type PathParams } from "@/shared/model/routes";
import { Link, useParams } from "react-router-dom";

export function BoardPage() {
  const params = useParams<PathParams[typeof ROUTES.BOARD]>();

  return (
    <div>
      <div>This is the board page #{params.id} </div>
      <Link to={ROUTES.BOARDS}>Back to boards</Link>
    </div>
  );
}

export const Component = BoardPage;