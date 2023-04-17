import { ContainerCol } from "../../components/Layout/ContainerCol";

export const ChatChannelArea = () => {
    const channels: string[] = [];
    for (let n = 0; n < 100; n++) {
        channels.push(`hoge ${n}`);
    }

    return (
        <ContainerCol>
            <h2>ChaChannelArea</h2>
            <hr />
            <ContainerCol>
                <div style={{ flex: "1", overflowY: "scroll" }}>
                    {channels.map((channel, idx) => (
                        <p key={idx}>{channel}</p>
                    ))}
                </div>
            </ContainerCol>
        </ContainerCol>
    );
};
