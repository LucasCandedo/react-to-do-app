import { Menu, CalendarFold, MoreHorizontal } from "lucide-react";
import { Button } from "./components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogClose,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "./components/ui/dialog";
import { Field, FieldGroup } from "./components/ui/field";
import { Label } from "./components/ui/label";
import { Input } from "./components/ui/input";
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./components/ui/card";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "./components/ui/dropdown-menu";
import { toast, Toaster } from "sonner";
import { useKeyboardOpen } from "./hooks/useKeyboardOpen";

function App() {
  const keyboardOpen = useKeyboardOpen();

  const [tasks, setTasks] = useState<
    {
      title: string;
      description: string;
      date: string;
      completed: boolean;
    }[]
  >(() => {
    const savedTasks = localStorage.getItem("tasks");

    return savedTasks ? JSON.parse(savedTasks) : [];
  });

  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }, [tasks]);

  const handleAddTask = (title: string, description: string, date: string) => {
    if (!title.trim()) {
      toast.error("El título no puede estar vacío");
      return false;
    }

    if (title.length > 64) {
      toast.error("El título no puede tener más de 64 caracteres");
      return false;
    }

    if (description.length > 256) {
      toast.error("La descripción no puede tener más de 256 caracteres");
      return false;
    }

    const newTask = {
      title,
      description,
      date,
      completed: false,
    };

    setTasks((prevTasks) => [...prevTasks, newTask]);

    return true;
  };

  const handleDeleteTask = (index: number) => {
    setTasks((prevTasks) => prevTasks.filter((_, i) => i !== index));
    toast.success("La tarea fue eliminada exitosamente");
  };

  const [editingIndex, setEditingIndex] = useState<number | null>(null);

  const handleOpenEditDialog = (index: number) => {
    const task = tasks[index];

    setTitle(task.title);
    setDescription(task.description);
    setDate(task.date);

    setEditingIndex(index);
    setOpen(true);
  };

  const handleEditTask = (
    index: number,
    title: string,
    description: string,
    date: string,
  ) => {
    setTasks((prevTasks) =>
      prevTasks.map((task, i) =>
        i === index ? { ...task, title, description, date } : task,
      ),
    );
    toast.success("La tarea fue editada exitosamente");
  };

  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState("");
  return (
    <>
      <Toaster />
      <header className="header-menu pt-[env(safe-area-inset-top)] h-16 mx-8 my-4 flex justify-start items-center gap-4">
        <button className="w-10 h-10 flex items-center justify-center rounded-md hover:bg-muted">
          <Menu className="w-full h-full" />
        </button>
        <h1 className="header-menu_title">Lista de tareas</h1>
      </header>
      <main className="task-container mx-10">
        <header className="task-container_header flex justify-between mb-8">
          <h2 className="task-container_header_title">Mis tareas</h2>
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button
                onClick={() => {
                  setEditingIndex(null);

                  setTitle("");
                  setDescription("");
                  setDate("");
                }}
              >
                Agregar tarea
              </Button>
            </DialogTrigger>
            <DialogContent
              className={`
                fixed
                mx-auto
                max-w-md
                overflow-y-auto
                transition-all
                duration-200
                ${keyboardOpen ? "top-60 max-h-[85vh]" : "bottom-2 max-h-[60vh]"}
              `}
            >
              <DialogTitle>
                {editingIndex !== null ? "Editar tarea" : "Agregar nueva tarea"}
              </DialogTitle>
              <FieldGroup>
                <Field>
                  <Label htmlFor="task-title">Titulo</Label>
                  <Input
                    id="task-title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    minLength={1}
                    maxLength={64}
                    placeholder="Ingrese el título de la tarea"
                  />
                </Field>
                <Field>
                  <Label htmlFor="task-description">Descripción</Label>
                  <Input
                    id="task-description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    minLength={1}
                    maxLength={256}
                    placeholder="Ingrese la descripción de la tarea"
                  />
                </Field>
                <Field>
                  <Label htmlFor="task-date">Fecha de vencimiento</Label>
                  <Input
                    id="task-date"
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    placeholder="Seleccione la fecha de la Tarea"
                  />
                </Field>
              </FieldGroup>
              <DialogFooter>
                <DialogClose asChild>
                  <Button variant="outline" className="">
                    Cancelar
                  </Button>
                </DialogClose>
                <Button
                  onClick={() => {
                    if (editingIndex !== null) {
                      handleEditTask(editingIndex, title, description, date);

                      setEditingIndex(null);
                      setOpen(false);

                      return;
                    }

                    const success = handleAddTask(title, description, date);

                    if (editingIndex !== null) {
                      handleEditTask(editingIndex, title, description, date);

                      setEditingIndex(null);
                      setOpen(false);

                      return;
                    }

                    if (success) {
                      setOpen(false);

                      toast.success(
                        `La tarea "${title}" fue agregada exitosamente`,
                      );
                    }
                  }}
                >
                  {editingIndex !== null ? "Guardar cambios" : "Guardar"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </header>
        {tasks.length === 0 ? (
          <p className="text-center text-muted-foreground p-10">
            No hay tareas por ahora. ¡Agrega una nueva tarea para empezar!
          </p>
        ) : (
          tasks.map((task, index) => (
            <Card key={index} className="mb-4">
              <CardHeader>
                <div className="card-header flex justify-between align-items gap-3 w-full h-10">
                  <div className="card-header-title w-fit-content h-full flex items-center gap-2">
                    <CalendarFold className="w-4 h-4" />
                    <CardTitle>{task.title}</CardTitle>
                  </div>
                  <div className="card-header-dropdown-menu h-full">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent>
                        <DropdownMenuItem
                          onClick={() => handleOpenEditDialog(index)}
                        >
                          Editar
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => handleDeleteTask(index)}
                        >
                          Eliminar
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="flex flex-wrap justify-start mb-2">
                <p className="w-full flex justify-start">{task.description}</p>
                {task.date && (
                  <p className="w-full justify-start text-sm text-muted-foreground mt-2 ">
                    Programado para el{" "}
                    {new Date(task.date).toLocaleDateString("es-ES", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </p>
                )}
              </CardContent>
            </Card>
          ))
        )}
      </main>
    </>
  );
}

export default App;
