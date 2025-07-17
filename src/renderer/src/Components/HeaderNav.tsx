import Button from "@mui/material/Button";
import { useNavigate } from "react-router-dom";

const pages = [{ linkText: "Events", url: "events" }];
const settings = ["Profile", "Account", "Dashboard", "Logout"];

function HeaderNav() {
  const navigator = useNavigate();

  const linkClicked = (dest?: string) => {
    if (dest) {
      navigator(dest);
    }
  };

  return (
    <div className='appHeader'>
      <h1>CombatStats</h1>
      <div className='flex gap-2'>
        {pages.map((page) => (
          <Button
            key={page.linkText}
            onClick={() => linkClicked(page.url)}
            sx={{ my: 2, color: "white", display: "block" }}>
            {<>{page.linkText}</>}
          </Button>
        ))}
      </div>
    </div>
  );
}
export default HeaderNav;
