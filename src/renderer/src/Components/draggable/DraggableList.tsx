import { Box } from "@mui/material";
import { useState } from "react";
import { CSBracket } from "../../Models";

type DraggableListProps<T = any> = {
  itemList: T;
};

const DraggableList = (props: DraggableListProps) => {
  const [items, setItems] = useState(props.itemList);

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
