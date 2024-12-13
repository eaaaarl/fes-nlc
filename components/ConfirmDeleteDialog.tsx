import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "./ui/alert-dialog";
import { Loader, Trash2 } from "lucide-react"; 

interface ConfirmDeleteDialog {
  isOpen: boolean;
  onCancel: () => void;
  onConfirm: () => void;
  itemName?: string;
  isLoading?: boolean;
}

export default function ConfirmDeleteDialog({
  isOpen,
  onCancel,
  onConfirm,
  itemName,
  isLoading
}: ConfirmDeleteDialog) {
  return (
    <AlertDialog open={isOpen}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            <div className="flex items-center">
              <Trash2 className="mr-2 text-red-600" />
              Confirm Delete
            </div>
          </AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to delete{" "}
            <span className="font-bold">{itemName}</span>? This action cannot be
            undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={onCancel}>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={onConfirm}
            className="bg-red-600 text-white hover:bg-red-400 transition-colors duration-200"
          >
            {isLoading ?
              (<Loader className="h-4 w-4 animate-spin" />) :
              <>
                <Trash2 className="h-4 w-4 mr-2" /> Delete
              </>
            }
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
