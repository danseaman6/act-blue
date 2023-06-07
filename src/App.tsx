import skaBand from "./band-json/ska-band.json";
import kpopBand from "./band-json/kpop-band.json";
import punkBand from "./band-json/punk-band.json";
import { styled } from "styled-components";
import { createTheme, ThemeProvider } from "@mui/material/styles";

import BandForm from "./BandForm";

const theme = createTheme({
  palette: {
    primary: {
      main: "#606060",
    },
  },
});

const Page = styled.div`
  width: 100vw;
  max-width: 1440px;
  padding-top: 100px;
  padding-left: 100px;
  padding-right: 100px;
`;

function App() {
  const bands = [skaBand, kpopBand, punkBand];
  return (
    <ThemeProvider theme={theme}>
      <Page>
        <BandForm band={bands[1]} />
      </Page>
    </ThemeProvider>
  );
}

export default App;
