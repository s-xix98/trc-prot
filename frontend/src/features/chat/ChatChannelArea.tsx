import { Container } from "../../components/Layout/Container";

export const ChatChannelArea = () => {
    const channels: string[] = [];
    for (let n = 0; n < 100; n++) {
        channels.push(`hoge ${n}`);
    }

    return (
        <Container>
            <h2>ChaChannelArea</h2>
            <hr />
            <Container>
                <div style={{ flex: "1", overflowY: "scroll" }}>
                    {channels.map((channel, idx) => (
                        <p key={idx}>{channel}</p>
                    ))}
                </div>
            </Container>
        </Container>
    );
};
