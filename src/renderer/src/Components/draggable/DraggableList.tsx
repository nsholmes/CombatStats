import { Box } from "@mui/material";
import { CSBracket } from "@nsholmes/combat-stats-types/event.model";
import { useState } from "react";

type DraggableListProps<T = any> = {
  itemList: T;
};

const DraggableList = (props: DraggableListProps) => {
  const [items, setItems] = useState(props.itemList);
  void setItems;

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
          <div key={item.bracketId}></div>
        ))}
      </Box>
    </Box>
  );
};

export default DraggableList;
