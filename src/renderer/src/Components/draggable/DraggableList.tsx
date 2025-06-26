import { Box } from "@mui/material";
import { useState } from "react";
import { CSBracket } from "../../Models";

type DraggableListProps<T = any> = {
  itemList: T;
};

const DraggableList = (props: DraggableListProps) => {
  const [items, setItems] = useState(props.itemList);

  // useEffect(() => {
  //   return monitorForElements({
  //     canMonitor({ source }) {
  //       return isListData(source.data);
  //     },
  //     onDrop({ location, source }) {
  //       const target = location.current.dropTargets[0];
  //       if (!target) {
  //         return;
  //       }

  //       const sourceData = source.data;
  //       const targetData = source.data;

  //       if (!isListData(sourceData) || !isListData(targetData)) {
  //         return;
  //       }

  //       const indexOfSource = items.findIndex(
  //         (item) => item.participantId === sourceData.participant.participantId
  //       );
  //       const indexOfTarget = items.findIndex(
  //         (item) => item.participantId === targetData.participant.participantId
  //       );

  //       if (indexOfTarget < 0 || indexOfSource < 0) {
  //         return;
  //       }

  //       const closestEdgeOfTarget = extractClosestEdge(targetData);

  //       // Using `flushSync` so we can query the DOM straight after this line
  //       flushSync(() => {
  //         setItems(
  //           reorderWithEdge({
  //             list: items,
  //             startIndex: indexOfSource,
  //             indexOfTarget,
  //             closestEdgeOfTarget,
  //             axis: "vertical",
  //           })
  //         );
  //       });
  //       // Being simple and just querying for the task after the drop.
  //       // We could use react context to register the element in a lookup,
  //       // and then we could retrieve that element after the drop and use
  //       // `triggerPostMoveFlash`. But this gets the job done.
  //       const element = document.querySelector(
  //         `[data-task-id="${sourceData.participant.participantId}"]`
  //       );
  //       if (element instanceof HTMLElement) {
  //         triggerPostMoveFlash(element);
  //       }
  //     },
  //   });
  // }, [items]);

  return (
    <Box sx={{ margin: "auto 0px", width: "420px" }}>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: "8px",
        }}>
        {/* <List items={props.itemList} /> */}
        {items.map((item: CSBracket) => (
          <></>
        ))}
      </Box>
    </Box>
  );
};

export default DraggableList;
