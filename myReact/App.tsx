import * as React from 'react';
import { useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import {
  View,
  Text,
  TextInput,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Switch,
  Alert,
  Modal,
} from 'react-native';

// 질문 객체 타입 정의
type Question = {
  id: string;
  title: string;
  type: 'short' | 'long' | 'multiple';
  required: boolean;
  options: string[];
};

// 더미 데이터
const initialQuestions: Question[] = [
  { id: '1', title: '이름', type: 'short', required: false, options: [] },
  {
    id: '2',
    title: '나이',
    type: 'multiple',
    required: false,
    options: ['20대', '30대'],
  },
];

// 스크린 컴포넌트
const HomeScreen = () => {
  const [questions, setQuestions] = useState<Question[]>(initialQuestions);
  const [selectedQuestionType, setSelectedQuestionType] = useState<'short' | 'long' | 'multiple'>('short');
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [currentQuestionId, setCurrentQuestionId] = useState<string | null>(null);

  // 질문 추가
  const addQuestion = () => {
    const newQuestion: Question = {
      id: (questions.length + 1).toString(),
      title: `질문 ${questions.length + 1}`,
      type: selectedQuestionType,
      required: false,
      options: selectedQuestionType === 'multiple' ? ['20대', '30대'] : [],
    };
    setQuestions([...questions, newQuestion]);
  };

  // 질문 삭제
  const deleteQuestion = (id: string) => {
    setQuestions(questions.filter((q: Question) => q.id !== id));
  };

  // 필수 여부 토글
  const toggleRequired = (id: string) => {
    setQuestions(
      questions.map((q: Question) =>
        q.id === id ? { ...q, required: !q.required } : q
      )
    );
  };

  // 질문 타입 변경
  const changeQuestionType = (id: string, type: 'short' | 'long' | 'multiple') => {
    if (id && questions.find((q) => q.id === id)) {
      setQuestions(
        questions.map((q: Question) =>
          q.id === id
            ? {
                ...q,
                type,
                options: type === 'multiple' ? ['20대', '30대'] : [],
              }
            : q
        )
      );
    }
    setModalVisible(false);
  };

  return (
    <View style={styles.container}>
      {/* 모달 (커스텀 드롭다운) */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <TouchableOpacity
              onPress={() => {
                if (currentQuestionId) changeQuestionType(currentQuestionId, 'short');
              }}
            >
              <Text style={styles.modalOption}>단답형</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                if (currentQuestionId) changeQuestionType(currentQuestionId, 'long');
              }}
            >
              <Text style={styles.modalOption}>장문형</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                if (currentQuestionId) changeQuestionType(currentQuestionId, 'multiple');
              }}
            >
              <Text style={styles.modalOption}>객관식 질문</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setModalVisible(false)}>
              <Text style={styles.modalCancel}>취소</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* 제목과 미리 보기 버튼 */}
      <View style={styles.header}>
        <Text style={styles.formTitle}>DoubleT 과제</Text>
        <TouchableOpacity
          onPress={() => Alert.alert('미리 보기', '미리 보기 기능이 실행됩니다.')}
        >
          <Text style={styles.previewText}>미리보기</Text>
        </TouchableOpacity>
      </View>
      <Text style={styles.formDescription}>과제 진행</Text>

      {/* 질문 리스트 */}
      <FlatList
        data={questions}
        keyExtractor={(item: Question) => item.id}
        renderItem={({ item }: { item: Question }) => (
          <View style={styles.questionContainer}>
            <View style={styles.questionHeader}>
              <Text style={styles.questionTitle}>{item.title}</Text>
              {/* 질문 타입 선택 (커스텀 드롭다운) */}
              <TouchableOpacity
                onPress={() => {
                  setCurrentQuestionId(item.id);
                  setModalVisible(true);
                }}
              >
                <Text style={styles.dropdownText}>
                  {item.type === 'short' ? '단답형' : item.type === 'long' ? '장문형' : '객관식 질문'}
                </Text>
              </TouchableOpacity>
            </View>

            {/* 질문 타입에 따른 입력 UI */}
            {item.type === 'short' && (
              <TextInput
                style={styles.input}
                placeholder="단답형 답변"
                placeholderTextColor="#999"
              />
            )}
            {item.type === 'long' && (
              <TextInput
                style={[styles.input, { height: 80 }]}
                placeholder="장문형 답변"
                placeholderTextColor="#999"
                multiline
              />
            )}
            {item.type === 'multiple' && (
              <View>
                {item.options.map((option, index) => (
                  <View key={index} style={styles.option}>
                    <Text style={styles.radio}>O</Text>
                    <Text style={styles.optionText}>{option}</Text>
                  </View>
                ))}
              </View>
            )}
          </View>
        )}
      />

      {/* 제출 버튼 */}
      <TouchableOpacity style={styles.submitButton}>
        <Text style={styles.submitButtonText}>제출</Text>
      </TouchableOpacity>

    </View>
  );
};

// 스택 네비게이터 생성
const Stack = createNativeStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={{
            title: '설문지',
            headerStyle: { backgroundColor: '#f5f5f5' },
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

// 스타일
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 15,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  formTitle: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  previewText: {
    fontSize: 16,
    color: '#666',
  },
  formDescription: {
    fontSize: 16,
    color: '#666',
    backgroundColor: '#fff',
    padding: 15,
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
    borderWidth: 1,
    borderColor: '#ddd',
    borderTopWidth: 0,
  },
  questionContainer: {
    backgroundColor: '#fff',
    marginTop: 20,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 15,
  },
  questionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  questionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    flex: 1,
  },
  dropdownText: {
    fontSize: 16,
    color: '#666',
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 5,
    borderRadius: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    fontSize: 16,
    marginTop: 10,
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
  },
  radio: {
    marginRight: 10,
    fontSize: 16,
  },
  optionText: {
    fontSize: 16,
  },
  questionOptions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#ddd',
    paddingTop: 10,
  },
  requiredToggle: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  deleteText: {
    fontSize: 16,
    color: '#666',
  },
  integrationNote: {
    marginTop: 20,
    padding: 10,
    backgroundColor: '#fff',
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  integrationText: {
    fontSize: 14,
    color: '#666',
  },
  submitButton: {
    backgroundColor: '#673ab7',
    padding: 15,
    borderRadius: 5,
    marginTop: 20,
    alignItems: 'center',
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  floatingButton: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    backgroundColor: '#673ab7',
    borderRadius: 50,
    width: 50,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addText: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    width: '80%',
  },
  modalOption: {
    fontSize: 16,
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  modalCancel: {
    fontSize: 16,
    padding: 10,
    color: '#ff0000',
    textAlign: 'center',
  },
});

export default App;