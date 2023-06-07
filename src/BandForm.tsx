import { useEffect, useState } from "react";
import { Button, InputAdornment, OutlinedInput } from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import moment from "moment";
import styled from "styled-components";
import { Row, Column } from "./ui.ts";
import { CounterInput } from "./CounterInput.tsx";
import CreditCardIcon from "@mui/icons-material/CreditCard";
import DateRangeIcon from "@mui/icons-material/DateRange";
import PlaceIcon from "@mui/icons-material/Place";

type TBand = Partial<{
  name: string;
  id: string;
  date: number; // dateTime
  location: string;
  description_blurb: string;
  imgUrl: string;
  ticketTypes: TTicket[];
}>;

type TTicket = {
  type: string;
  name: string;
  description: string;
  cost: number; // cents
};

type State = Partial<{
  firstName: string;
  lastName: string;
  address: string;
  cardNumber: string;
  expiration: string;
  cvv: string;
  selectedTickets: {
    [ticketType: string]: number;
  };
  total: number;
}>;

const Title = styled.h3`
  font-weight: bold;
  font-size: 48px;
  line-height: 36px;
  font-family: "Montserrat", -apple-system, BlinkMacSystemFont, "Segoe UI",
    sans-serif;
  margin: 0;
  color: #252b32;
`;

const Subtitle = styled.h3`
  font-weight: normal;
  font-size: 20px;
  line-height: 20px;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
  margin: 0;
  color: #7d8ca1;
`;

const FormTitle = styled.h3`
  font-weight: bold;
  font-size: 36px;
  line-height: 36px;
  font-family: "Montserrat", -apple-system, BlinkMacSystemFont, "Segoe UI",
    sans-serif;
  margin: 0;
  color: #252b32;
`;

const FormSubtitle = styled.h3`
  font-weight: bold;
  font-size: 24px;
  line-height: 36px;
  font-family: "Montserrat", -apple-system, BlinkMacSystemFont, "Segoe UI",
    sans-serif;
  margin: 0;
  color: #252b32;
`;

const Ticket = styled(Row)`
  padding-bottom: 40px;
  border-bottom: 2px solid #d5d6d8;
`;

const TicketTitle = styled.p`
  font-size: 24px;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
  text-transform: uppercase;
  margin: 0;
  color: #797a7a;
`;

const Total = styled.p`
  flex: 1 0 auto;
  font-size: 30px;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
  text-transform: uppercase;
  margin: 0;
  color: #797a7a;
`;

const TotalNumber = styled(Total)`
  flex: 0 0 auto;
  font-weight: 600;
`;

const Copy = styled.p`
  font-size: 14px;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
  color: #7d8ca1;

  p {
    font-size: 14px;
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
  }

  h3 {
    font-size: 16px;
    font-weight: bold;
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
  }
`;

const Image = styled.img`
  width: 100%;
  max-width: 450px;
  border-radius: 4px;
  //aspect-ratio: 450/350;
`;

const ImageColumn = styled(Column)`
  flex: 1;
`;

const TicketFormColumn = styled(Column)`
  max-width: 710px;
  background-color: #f7f8fa;
  border-radius: 4px;
  padding: 40px 60px;
  align-items: stretch;
`;

const FormField = styled(OutlinedInput)`
  flex: 1;
  font-size: 20px;
  background-color: #ffffff;
  border: 2px solid #797a7a;
  border-radius: 0;
  .MuiOutlinedInput-notchedOutline {
    border: none;
  }
`;

const DateField = styled(DatePicker)`
  flex: 1;
  background-color: #ffffff;
  border: 2px solid #797a7a;
  border-radius: 0;
  .MuiOutlinedInput-notchedOutline {
    border: none;
  }
  .MuiInputBase-root {
    font-size: 20px;
  }
`;

const PurchaseButton = styled(Button)`
  width: 100%;
  height: 50px;
  background-color: #606060;
`;

const ButtonTitle = styled.p`
  font-size: 24px;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
  margin: 0;
  color: #ffffff;
  text-transform: capitalize;
`;

function BandForm({ band }: { band: TBand }) {
  const [formData, setFormData] = useState<State>({});
  const displayDate = () => {
    const date = moment(band.date);
    return date.format("dddd, MMMM D");
  };

  const formatCardNumber = (value: string) => {
    const v = value
      .replace(/\s+/g, "")
      .replace(/[^0-9]/gi, "")
      .substr(0, 16);
    const parts = [];

    for (let i = 0; i < v.length; i += 4) {
      parts.push(v.substr(i, 4));
    }

    return parts.length > 1 ? parts.join(" ") : value;
  };

  const formatCVV = (value: string) => {
    return value.replace(/[^0-9]/gi, "").substr(0, 3);
  };

  const handleTextChange = (name: string, value: string) => {
    setFormData({ ...formData, [name]: value });
  };

  const handleTicketChange = (ticketType: string, value: number) => {
    console.log(value);
    setFormData({
      ...formData,
      selectedTickets: {
        ...formData.selectedTickets,
        [ticketType]: value,
      },
    });
  };

  useEffect(() => {
    const total = Object.entries(formData.selectedTickets ?? {}).reduce(
      (acc, [ticketType, quantity]) => {
        const ticket = band.ticketTypes?.find((t) => t.type === ticketType);
        return acc + (ticket?.cost ?? 0) * quantity;
      },
      0
    );
    setFormData({ ...formData, total });
  }, [band.ticketTypes, formData]);

  return (
    <form>
      <Column gap="48px">
        <Row>
          <Column gap="24px">
            <Title>{band.name}</Title>
            <Column gap="12px">
              <Row gap="8px">
                <DateRangeIcon />
                <Subtitle>{displayDate()}</Subtitle>
              </Row>
              <Row gap="8px">
                <PlaceIcon />
                <Subtitle>{band.location}</Subtitle>
              </Row>
            </Column>
          </Column>
        </Row>
        <Row gap={"48px"}>
          <ImageColumn>
            <Image src={band.imgUrl} alt={band.name} />
            <Copy
              dangerouslySetInnerHTML={{ __html: band.description_blurb ?? "" }}
            />
          </ImageColumn>
          <TicketFormColumn gap="40px">
            <Row>
              <FormTitle>Select Tickets</FormTitle>
            </Row>
            {band.ticketTypes?.map((ticket: TTicket) => (
              <Ticket gap="90px" key={ticket.name}>
                <Column>
                  <TicketTitle>{ticket.name}</TicketTitle>
                  <Copy>{ticket.description}</Copy>
                  <TicketTitle>
                    {`$${ticket?.cost ? ticket.cost / 100 : "0"}`}
                  </TicketTitle>
                </Column>
                <Column>
                  <CounterInput
                    value={formData.selectedTickets?.[ticket.type] ?? 0}
                    onChange={(value) => handleTicketChange(ticket.type, value)}
                  />
                </Column>
              </Ticket>
            ))}

            <Row>
              <Total>TOTAL</Total>
              <TotalNumber>{`$${
                formData.total ? formData.total / 100 : "0"
              }`}</TotalNumber>
            </Row>
            <Column gap="16px">
              <Row gap="12px">
                <FormField
                  name="firstName"
                  type="text"
                  placeholder="First Name"
                  value={formData.firstName}
                  onChange={({ target }) =>
                    handleTextChange(target.name, target.value)
                  }
                />
                <FormField
                  name="lastName"
                  type="text"
                  placeholder="Last Name"
                  value={formData.lastName}
                  onChange={({ target }) =>
                    handleTextChange(target.name, target.value)
                  }
                />
              </Row>
              <Row>
                <FormField
                  name="address"
                  type="text"
                  placeholder="Address"
                  onChange={({ target }) =>
                    handleTextChange(target.name, target.value)
                  }
                />
              </Row>
            </Column>
            <Column gap="20px">
              <Row>
                <FormSubtitle>Payment Details</FormSubtitle>
              </Row>
              <Column gap="16px">
                <Row>
                  <FormField
                    name="cardNumber"
                    type="text"
                    placeholder="0000 0000 0000 0000"
                    value={formatCardNumber(formData.cardNumber ?? "")}
                    onChange={({ target }) =>
                      handleTextChange(target.name, target.value)
                    }
                    endAdornment={
                      <InputAdornment position="end">
                        <CreditCardIcon />
                      </InputAdornment>
                    }
                  />
                </Row>
                <Row gap="12px">
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DateField
                      format="MM/YY"
                      views={["month", "year"]}
                      value={formData.expiration}
                      onChange={(value: any) =>
                        handleTextChange("expiration", value ?? "")
                      }
                    />
                  </LocalizationProvider>
                  <FormField
                    name="cvv"
                    type="text"
                    placeholder="CVV"
                    // smarter card forms can handle 3 or 4 numbers based on Amex or not
                    value={formatCVV(formData.cvv ?? "")}
                    onChange={({ target }) =>
                      handleTextChange(target.name, target.value)
                    }
                  />
                </Row>
              </Column>
            </Column>
            <PurchaseButton>
              {/*Typically a form submit input with data verification and an API post*/}
              <ButtonTitle>Get Tickets</ButtonTitle>
            </PurchaseButton>
          </TicketFormColumn>
        </Row>
      </Column>
    </form>
  );
}

export default BandForm;
