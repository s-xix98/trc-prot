import { Container } from "../../components/Layout/Container";
import { ContainerScrollItem } from "../../components/Layout/ContainerScrollItem";

export const ChatChannelArea = () => {
    const channels: string[] = [];
    for (let n = 0; n < 100; n++) {
        channels.push(`hoge ${n}`);
    }

    return (
        <Container isColumn={true}>
            <h2>ChatChannelArea</h2>
            <hr />
            <Container isColumn={true}>
                <ContainerScrollItem>
                    {channels.map((channel, idx) => (
                        <p key={idx}>{channel}</p>
                    ))}
                </ContainerScrollItem>
            </Container>
        </Container>
    );
};
