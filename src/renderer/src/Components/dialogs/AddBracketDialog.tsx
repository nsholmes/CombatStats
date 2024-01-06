
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Stack } from '@mui/material';

function AddBracketDialog(props: { open: boolean }) {

    // Event Handlers
    const saveClicked = () => {

    }
    const cancelClicked = () => {

    }
    return (
        <>
            <Dialog open={props.open}>
                <DialogTitle>Add New Bracket</DialogTitle>
                <DialogContent>
                    <form>
                        <Stack spacing={2} direction="row" sx={{ marginBottom: 4 }}>
                            <select>
                                {

                                }
                            </select>
                        </Stack>
                    </form>
                </DialogContent>
                <DialogActions>
                    <Button>Cancel</Button>
                    <Button>Save</Button>
                </DialogActions>
            </Dialog>
        </>
    );
}
export default AddBracketDialog;