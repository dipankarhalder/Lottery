import { isRouteErrorResponse, useRouteError } from "react-router-dom";

export const ErrorPage = () => {
  const error = useRouteError();

  return (
    <div>
      <h1>
        {isRouteErrorResponse(error) ? "Invalid Routes" : "This is error page"}
      </h1>
    </div>
  );
};
