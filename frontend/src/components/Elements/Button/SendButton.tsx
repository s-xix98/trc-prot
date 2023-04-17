import Button from "@mui/material/Button";
import SendIcon from "@mui/icons-material/Send";

export const SendButton = ({ sendBtnAct }: { sendBtnAct: () => void }) => {
    return (
        <Button
            variant="contained"
            endIcon={<SendIcon />}
            onClick={sendBtnAct}
            style={{ textAlign: "center" }}
        >
            Send
        </Button>
    );
};
