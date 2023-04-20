import { Container } from "../../components/Layout/Container";
import { ContainerItem } from "../../components/Layout/ContainerItem";

export const ChatChannelArea = () => {
    const channels: string[] = [];
    for (let n = 0; n < 100; n++) {
        channels.push(`hoge ${n}`);
    }

    return (
        <Container flexDirection={"column"}>
            <h2>ChatChannelArea</h2>
            <hr />
            <Container flexDirection={"column"}>
                <ContainerItem overflowY={"scroll"}>
                    {channels.map((channel, idx) => (
                        <p key={idx}>{channel}</p>
                    ))}
                </ContainerItem>
            </Container>
        </Container>
    );
};
