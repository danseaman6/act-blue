import skaBand from "./band-json/ska-band.json";
import kpopBand from "./band-json/kpop-band.json";
import punkBand from "./band-json/punk-band.json";
import { styled } from "styled-components";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { Row, Column } from "./ui.ts";
import BandForm from "./BandForm";
import { Button } from "@mui/material";
import { useState } from "react";

const theme = createTheme({
  palette: {
    primary: {
      main: "#606060",
    },
  },
});

const Page = styled(Column)`
  width: 100vw;
  max-width: 1440px;
  padding-top: 100px;
  padding-left: 100px;
  padding-right: 100px;
`;

const BandButton = styled(Button)`
  width: 100%;
  height: 50px;
`;

function App() {
  const bands = [skaBand, kpopBand, punkBand];
  const [currentBand, setCurrentBand] = useState(bands[0]);
  return (
    <ThemeProvider theme={theme}>
      <Page gap="40px">
        <Row gap="5%">
          {bands.map((band) => (
            <BandButton
              variant="contained"
              onClick={() => setCurrentBand(band)}
            >
              {band.name}
            </BandButton>
          ))}
        </Row>
        <BandForm band={currentBand} />
      </Page>
    </ThemeProvider>
  );
}

export default App;
