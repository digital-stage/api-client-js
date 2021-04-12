import { createContext, useRef } from 'react';
import useStageSelector from '../useStageSelector';
import { CustomStageMemberVolume, Device, StageMember } from '../../types';

interface ISpacialAudioRendererContext {}

const SpacialAudioRendererContext = createContext<ISpacialAudioRendererContext>(
  {}
);

const RenderStageMember = (props: { id: string }) => {
  const { id } = props;
  const localDevice = useStageSelector<Device | undefined>((state) =>
    state.globals.localDeviceId
      ? state.devices.byId[state.globals.localDeviceId]
      : undefined
  );
  const stageMember = useStageSelector<StageMember>(
    (state) => state.stageMembers.byId[id]
  );
  const customStageMemberVolume = useStageSelector<
    CustomStageMemberVolume | undefined
  >((state) =>
    localDevice &&
    stageMember &&
    state.customStageMemberVolumes.byDeviceAndStageMember[localDevice._id][
      stageMember._id
    ]
      ? state.customStageMemberVolumes.byId[
          state.customStageMemberVolumes.byDeviceAndStageMember[
            localDevice._id
          ][stageMember._id]
        ]
      : undefined
  );
  return {};
};

const SpacialAudioRendererProvider = (props: {
  children: React.ReactChildren;
}) => {
  const { children } = props;
  const audioRef = useRef<HTMLAudioElement>();

  const stageMemberIds = useStageSelector<string[]>(
    (state) => state.stageMembers.allIds
  );

  return (
    <SpacialAudioRendererContext.Provider value={{}}>
      {children}
      <audio ref={audioRef} />
    </SpacialAudioRendererContext.Provider>
  );
};
