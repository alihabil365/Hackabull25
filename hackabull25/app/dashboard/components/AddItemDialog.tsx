import AddItem from "@/components/addItem";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

function AddItemDialog() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" className="cursor-pointer">
          Add New Item
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add New Item</DialogTitle>
          <DialogDescription>
            Fill out the details below to add a new item to your inventory.
            Ensure all fields are accurate before submitting.
          </DialogDescription>
        </DialogHeader>

        {/* Hatem's Component */}
        <AddItem />
      </DialogContent>
    </Dialog>
  );
}
export default AddItemDialog;
