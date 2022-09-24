import React from "react";
import styled from "@emotion/styled";
import { Link } from "react-router-dom";

export const ZeroNineFourOhFour = () => {
  return (
    <FourOhFour>
      404.
      <br />
      Page not found.
      <br />
      <Link to={"/"}>Return to home</Link>
    </FourOhFour>
  );
};

const FourOhFour = styled.div`
  max-width: 600px;
  margin: 0 auto;
  text-align: center;
  padding-top: 60px;
  padding-bottom: 60px;
  font-size: 40px;
`;
