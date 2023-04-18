import { ContainerCol } from "../../components/Layout/ContainerCol";
import { ContainerScrollItem } from "../../components/Layout/ContainerScrollItem";

export const ChatChannelArea = () => {
    const channels: string[] = [];
    for (let n = 0; n < 100; n++) {
        channels.push(`hoge ${n}`);
    }

    return (
        <ContainerCol>
            <h2>ChatChannelArea</h2>
            <hr />
            <ContainerCol>
                <ContainerScrollItem>
                    {channels.map((channel, idx) => (
                        <p key={idx}>{channel}</p>
                    ))}
                </ContainerScrollItem>
            </ContainerCol>
        </ContainerCol>
    );
};
