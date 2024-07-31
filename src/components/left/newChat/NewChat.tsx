import React, { FC, memo, useCallback, useState } from 'react';

import { LeftColumnContent } from '../../../types';

import { LAYERS_ANIMATION_NAME } from '../../../util/windowEnvironment';

import Transition from '../../ui/Transition';
import NewChatStep1 from './NewChatStep1';
import NewChatStep2 from './NewChatStep2';

import './NewChat.scss';
import NewChannelSelect from './NewChannelSelect';
import NewChannelTypeInfo from './NewChannelTypeInfo';
import AgeRestrictionPolicy from './AgeRestrictionPolicy';
import NewCourseSelect from './NewCourseSelect';
import NewCourseTypeInfo from './NewCourseTypeInfo';

import NewMediaSaleTypeInfo from './NewMediaSaleTypeInfo';
import { getActions, withGlobal } from '../../../global';
import { GlobalState, TabState } from '../../../global/types';
import { selectTabState } from '../../../global/selectors';
import NewCourseStep1 from './NewCourseStep1';

export type ChannelType = 'public' | 'private' | 'subscription';
export type CourseType = 'online';

export interface ECreateCourse {
  startDate: string;
  endDate: string;
}

export type OwnProps = {
  isActive: boolean;
  isChannel?: boolean;
  isCourse?: boolean;
  isMediaSale?: boolean;
  onReset: () => void;
};

type StateProps = {
  leftScreen: LeftColumnContent;
};

const RENDER_COUNT = Object.keys(LeftColumnContent).length / 2;

const NewChat: FC<OwnProps & StateProps> = ({
  isActive,
  isChannel = false,
  isCourse,
  leftScreen,
  onReset,
}) => {
  const { setLeftScreen } = getActions();
  const [newChatMemberIds, setNewChatMemberIds] = useState<string[]>([]);
  const [channelType, setChannelType] = useState<ChannelType>('public');
  const [courseType, setCourseType] = useState<CourseType>('online');
  const [courseData, setCourseData] = useState<ECreateCourse>();

  const [cost, setCost] = useState<string>('');

  const handleNextStep = useCallback(() => {
    setLeftScreen({
      screen: isChannel
        ? LeftColumnContent.NewChannelStep2
        : LeftColumnContent.NewGroupStep2,
    });
  }, [isChannel]);

  return (
    <Transition
      id='NewChat'
      name={LAYERS_ANIMATION_NAME}
      renderCount={RENDER_COUNT}
      activeKey={leftScreen}
    >
      {(isStepActive) => {
        switch (leftScreen) {
          case LeftColumnContent.NewChannelSelect:
            return (
              <NewChannelSelect
                isActive={isActive}
                onNextStep={() =>
                  setLeftScreen({ screen: LeftColumnContent.NewChannelStep1 })
                }
                onReset={onReset}
                channelType={channelType}
                setChannelType={setChannelType}
              />
            );
          case LeftColumnContent.NewCoursSelect:
            return (
              <NewCourseSelect
                isActive={isActive}
                onNextStep={() =>
                  setLeftScreen({ screen: LeftColumnContent.NewCourseStep1 })
                }
                onReset={onReset}
                courseType={courseType}
                setCourseType={setCourseType}
              />
            );
          case LeftColumnContent.NewCourseTypeInfo:
            return (
              <NewCourseTypeInfo
                isActive={isActive}
                onNextStep={() =>
                  setLeftScreen({ screen: LeftColumnContent.NewCourseStep1 })
                }
                onReset={onReset}
              />
            );
          case LeftColumnContent.NewChannelTypeInfo:
            return (
              <NewChannelTypeInfo
                isActive={isActive}
                onNextStep={() =>
                  setLeftScreen({ screen: LeftColumnContent.NewChannelStep1 })
                }
                onReset={onReset}
                channelType={channelType}
              />
            );
          case LeftColumnContent.NewChannelStep1:
          case LeftColumnContent.NewGroupStep1:
            return (
              <NewChatStep1
                isChannel={isChannel}
                isActive={isActive}
                channelType={channelType}
                cost={cost}
                selectedMemberIds={newChatMemberIds}
                onSelectedMemberIdsChange={setNewChatMemberIds}
                onNextStep={handleNextStep}
                onReset={onReset}
                setCost={setCost}
              />
            );

          case LeftColumnContent.NewGroupStep2:
            return (
              <NewChatStep2
                isChannel={isChannel}
                isActive={isStepActive && isActive}
                memberIds={newChatMemberIds}
                onReset={onReset}
                onSelectedIdsChange={setNewChatMemberIds}
              />
            );
          case LeftColumnContent.NewChannelStep2:
            return (
              <NewChatStep2
                isChannel={isChannel}
                isActive={isStepActive && isActive}
                memberIds={newChatMemberIds}
                onReset={onReset}
                cost={cost}
                channelType={channelType}
                onSelectedIdsChange={setNewChatMemberIds}
              />
            );
          case LeftColumnContent.NewCourseStep1:
            return (
              <NewCourseStep1
                isActive={isStepActive && isActive}
                onReset={onReset}
                cost={cost}
                setCost={setCost}
                courseData={courseData}
                setCreateCourseData={setCourseData}
                onNextStep={() =>
                  setLeftScreen({ screen: LeftColumnContent.NewCourseStep2 })
                }
              />
            );

          case LeftColumnContent.NewCourseStep2:
            return (
              <NewChatStep2
                isChannel={true}
                isCourse={true}
                isActive={isStepActive && isActive}
                memberIds={newChatMemberIds}
                courseData={courseData}
                onReset={onReset}
                cost={cost}
                channelType={channelType}
                onSelectedIdsChange={setNewChatMemberIds}
              />
            );

          // case LeftColumnContent.NewMediaSaleInfo:
          //   return (
          //     <NewMediaSaleTypeInfo
          //       isActive={isActive}
          //       onNextStep={() =>
          //         onContentChange(LeftColumnContent.NewChannelStep1)
          //       }
          //       onReset={onReset}
          //     />
          //   );
          case LeftColumnContent.AgeRestriction:
            return (
              <AgeRestrictionPolicy isActive={isActive} onReset={onReset} />
            );
          case LeftColumnContent.AgeRestrictionForCourse:
            return (
              <AgeRestrictionPolicy
                isActive={isActive}
                onReset={onReset}
                isCourse={isCourse}
              />
            );
          default:
            return undefined;
        }
      }}
    </Transition>
  );
};

export default memo(
  withGlobal((global): StateProps => {
    const tabState = selectTabState(global);
    const { leftScreen } = tabState;
    return {
      leftScreen,
    };
  })(NewChat)
);
