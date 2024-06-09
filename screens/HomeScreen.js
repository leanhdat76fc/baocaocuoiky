import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, StyleSheet, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import firestore from '@react-native-firebase/firestore';
import unorm from 'unorm'; // Import thư viện unorm

const HomeScreen = () => {
  const [inputText, setInputText] = useState('');
  const [notes, setNotes] = useState([]);
  const [editingNoteId, setEditingNoteId] = useState(null);
  const [editingNoteText, setEditingNoteText] = useState('');

  // Load notes from Firestore when component mounts
  useEffect(() => {
    const unsubscribe = firestore()
      .collection('notes')
      .orderBy('createdAt', 'desc') 
      .onSnapshot(snapshot => {
        const notesList = [];
        snapshot.forEach(doc => {
          notesList.push({ id: doc.id, ...doc.data() });
        });
        setNotes(notesList);
      });

    return () => unsubscribe();
  }, []);

  const handleAddNote = () => {
    if (inputText.trim() !== '') {
      if (editingNoteId) {
        firestore()
          .collection('notes')
          .doc(editingNoteId)
          .update({
            text: inputText,
          })
          .then(() => {
            setInputText('');
            setEditingNoteId(null);
          })
          .catch(error => {
            console.error('Error updating note: ', error);
          });
      } else {
        firestore()
          .collection('notes')
          .add({
            text: inputText,
            createdAt: new Date(),
          })
          .then(() => {
            setInputText('');
          })
          .catch(error => {
            console.error('Error adding note: ', error);
          });
      }
    }
  };

  const handleEditNote = (id, text) => {
    setEditingNoteId(id);
    setEditingNoteText(text);
  };

  const handleSaveEdit = () => {
    if (editingNoteId && editingNoteText.trim() !== '') {
      firestore()
        .collection('notes')
        .doc(editingNoteId)
        .update({
          text: editingNoteText,
        })
        .then(() => {
          setEditingNoteId(null);
          setEditingNoteText('');
        })
        .catch(error => {
          console.error('Error updating note: ', error);
        });
    }
  };

  const handleDeleteNote = id => {
    firestore()
      .collection('notes')
      .doc(id)
      .delete()
      .catch(error => {
        console.error('Error deleting note: ', error);
      });
  };

  const renderItem = ({ item }) => (
    <View style={styles.item}>
      <Text>{item.text}</Text>
      <Text style={styles.timestamp}>{formatTimestamp(item.createdAt)}</Text>
      <View style={styles.buttonContainer}>
        <TouchableOpacity onPress={() => handleEditNote(item.id, item.text)}>
          <Text style={styles.editButton}>Edit</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => handleDeleteNote(item.id)}>
          <Text style={styles.deleteButton}>Delete</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const formatTimestamp = timestamp => {
    const date = timestamp.toDate();
    return date.toLocaleString();
  };

  // Hàm xử lý sự kiện onChangeText cho TextInput
  const handleTextInputChange = text => {
    setInputText(unorm.nfc(text)); // Sử dụng unorm để chuẩn hóa văn bản Unicode
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.inputContainer}>
        <TextInput
          style={[styles.input, styles.largeInput]}
          placeholder="Nhập ghi chú"
          value={inputText}
          onChangeText={handleTextInputChange} // Sử dụng hàm xử lý sự kiện đã được chỉnh sửa
          multiline={true}
        />
        <TouchableOpacity style={styles.addButton} onPress={handleAddNote}>
          <Text style={styles.buttonText}>Thêm</Text>
        </TouchableOpacity>
      </View>
      <FlatList
        data={notes}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        style={styles.list}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: '#fff',
  },
  inputContainer: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
  },
  addButton: {
    marginLeft: 10,
    backgroundColor: 'orange',
    padding: 10,
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  list: {
    flex: 1,
  },
  item: {
    flexDirection: 'column',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  editInput: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
  },
  editButton: {
    color: 'blue',
  },
  deleteButton: {
    color: 'red',
  },
  largeInput: {
    height: 150,
  },
  timestamp: {
    color: '#666',
    marginTop: 5,
    fontSize: 12,
  },
});

export default HomeScreen;
