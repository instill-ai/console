import { Nullable } from "../../../lib";
import { getAudioTypeFromBase64 } from "../lib";
import { ConnectorNodeFieldRoot, EndNodeFieldRoot } from "./FieldRoot";

export type AudiosFieldProps = {
	nodeType: "end" | "connector";
	title: Nullable<string>;
	audios: Nullable<string[]>;
};

export const AudiosField = (props: AudiosFieldProps) => {
	const { nodeType, title, audios } = props;

	if (nodeType === "connector") {
		return (
			<ConnectorNodeFieldRoot title={title} key={`${title}-field`}>
				<div className="flex w-full flex-col">
					{audios ? (
						audios.map((audio) => {
							const audioType = audio ? getAudioTypeFromBase64(audio) : null;
							return (
								<audio
									key={`${title}-${audio}-field`}
									className="w-full"
									controls={true}
									src={`data:audio/${audioType};base64,${audio}`}
								/>
							);
						})
					) : (
						<></>
					)}
				</div>
			</ConnectorNodeFieldRoot>
		);
	}

	return (
		<EndNodeFieldRoot title={title} key={`${title}-field`}>
			<div className="flex w-full flex-col">
				{audios ? (
					audios.map((audio) => {
						const audioType = audio ? getAudioTypeFromBase64(audio) : null;
						return (
							<audio
								key={`${title}-${audio}-field`}
								className="w-full"
								controls={true}
								src={`data:audio/${audioType};base64,${audio}`}
							/>
						);
					})
				) : (
					<></>
				)}
			</div>
		</EndNodeFieldRoot>
	);
};
