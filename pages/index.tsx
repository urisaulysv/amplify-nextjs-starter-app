// pages/index.tsx
import { useState, useEffect } from "react";
import { generateClient } from "aws-amplify/data";
import type { Schema } from "@/amplify/data/resource";
import {
  Table,
  TableCell,
  TableBody,
  TableHead,
  TableRow,
  CheckboxField,
  Button,
  Input,
  SelectField,
  Flex,
} from "@aws-amplify/ui-react";

// generate your data client using the Schema from your backend
const client = generateClient<Schema>();

export default function HomePage() {
  const [todos, setTodos] = useState<Schema["Todo"][]>([]);
  const [createForm, setCreateForm] = useState<Schema["Todo"]>({
    content: "",
    priority: "medium",
    done: false,
    id: "",
    createdAt: "",
    updatedAt: "",
  });

  console.log(todos);

  useEffect(() => {
    const sub = client.models.Todo.observeQuery().subscribe(({ items }) =>
      setTodos([...items])
    );

    return () => sub.unsubscribe();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setCreateForm({ ...createForm, [e.target.name]: e.target.value });

    const handleChangeSelect: React.ChangeEventHandler<HTMLSelectElement> = (e) => {
        setCreateForm({ ...createForm, [e.target.name]: e.target.value });
    };

  return (
    <main>
      <h1>Hello, Amplify 👋</h1>

      <Flex>
        <Input
          placeholder="Title"
          width={"50%"}
          name="content"
          value={String(createForm.content)}
          onChange={handleChange}
        />
        <SelectField
          labelHidden={true}
          label="Priority"
          width={"10%"}
          value={createForm.priority === null ? "meduim" : createForm.priority}
          name="priority"
          onChange={handleChangeSelect}
          options={['high', 'medium', 'low']}
          />
        <Button
          onClick={async () => {
            // create a new Todo with the following attributes
            const { errors, data: newTodo } = await client.models.Todo.create({
              content: createForm.content,
              done: createForm.done,
              priority: createForm.priority,
            });
            console.log(errors, newTodo);
            await setCreateForm({...createForm, content: "", done: null, priority: "medium"});
          }}
        >
          Create{" "}
        </Button>
      </Flex>

      <Table highlightOnHover={true}>
        <TableHead>
          <TableRow>
            <TableCell as="th">Title</TableCell>
            <TableCell as="th">Priority</TableCell>
            <TableCell as="th">Status</TableCell>
            <TableCell as="th">Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {todos.map((todo) => (
            <TableRow key={todo.id}>
              <TableCell>{todo.content}</TableCell>
              <TableCell>{todo.priority}</TableCell>
              <TableCell>
                <CheckboxField label={""} name="done" checked={todo.done ? true : false} value="yes" />
              </TableCell>
              <TableCell>
                <Button
                  onClick={async () => {
                    // create a new Todo with the following attributes
                    const { errors } = await client.models.Todo.delete({
                      id: todo.id,
                    });
                    console.log(errors);
                  }}
                  style={{ color: "red", border: "1px solid red" }}
                >
                  Delete
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </main>
  );
}
