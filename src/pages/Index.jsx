import React, { useState, useEffect } from "react";
import { Container, VStack, Button, Input, Box, Text, IconButton, useToast } from "@chakra-ui/react";
import { FaTrash, FaPlus } from "react-icons/fa";

const Index = () => {
  const [notes, setNotes] = useState([]);
  const [newNote, setNewNote] = useState("");
  const toast = useToast();

  useEffect(() => {
    fetchNotes();
  }, []);

  const fetchNotes = async () => {
    try {
      const response = await fetch("https://api.zerosheets.com/v1/7ox");
      const data = await response.json();
      setNotes(data);
    } catch (error) {
      toast({
        title: "Error fetching notes",
        description: error.message,
        status: "error",
        duration: 9000,
        isClosable: true,
      });
    }
  };

  const addNote = async () => {
    if (!newNote.trim()) return;
    try {
      const response = await fetch("https://api.zerosheets.com/v1/7ox", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ content: newNote.trim() }),
      });
      if (response.ok) {
        fetchNotes();
        setNewNote("");
      }
    } catch (error) {
      toast({
        title: "Error adding note",
        description: error.message,
        status: "error",
        duration: 9000,
        isClosable: true,
      });
    }
  };

  const deleteNote = async (lineNumber) => {
    try {
      const response = await fetch(`https://api.zerosheets.com/v1/7ox/${lineNumber}`, {
        method: "DELETE",
      });
      if (response.ok) {
        fetchNotes();
      }
    } catch (error) {
      toast({
        title: "Error deleting note",
        description: error.message,
        status: "error",
        duration: 9000,
        isClosable: true,
      });
    }
  };

  return (
    <Container centerContent maxW="container.md" py={8}>
      <VStack spacing={4} w="full">
        <Box w="full" p={4} borderWidth="1px" borderRadius="lg">
          <Input placeholder="Add a new note" value={newNote} onChange={(e) => setNewNote(e.target.value)} size="lg" />
          <Button leftIcon={<FaPlus />} colorScheme="teal" mt={2} onClick={addNote}>
            Add Note
          </Button>
        </Box>
        {notes.map((note) => (
          <Box key={note._lineNumber} w="full" p={4} borderWidth="1px" borderRadius="lg" display="flex" justifyContent="space-between" alignItems="center">
            <Text>{note.content}</Text>
            <IconButton aria-label="Delete note" icon={<FaTrash />} onClick={() => deleteNote(note._lineNumber)} colorScheme="red" />
          </Box>
        ))}
      </VStack>
    </Container>
  );
};

export default Index;
