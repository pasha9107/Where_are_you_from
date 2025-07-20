import React, { useState, useEffect } from 'react';
import { YMaps, Map, Placemark, ZoomControl } from '@pbe/react-yandex-maps';
import MyInput from '../components/UI/MyInput';
import MyButton from '../components/UI/MyButton';
import StudentCard from '../components/StudentCard';
import '../styles/MapPage.css';

const MapPage = () => {
  const [studentsData, setStudentsData] = useState([
    {
      id: 1,
      cityCoords: [55.751574, 37.573856],
      cityName: 'Москва',
      studentName: 'Иван Иванов',
      story: 'Поступил на ИСАУ в 2022 году. Рассказали друзья про классный университет. Приеахл и подал документы. Мне повезло, что я попал сюда',
    },
    {
      id: 2,
      cityCoords: [55.751574, 37.573856],
      cityName: 'Москва',
      studentName: 'Виктор Петров',
      story: 'Поступил на ИСАУ в 2022 году. Рассказали друзья про классный университет. Приеахл и подал документы. Мне повезло, что я попал сюда',
    },
    {
      id: 3,
      cityCoords: [59.9342802, 30.3350986],
      cityName: 'Санкт-Петербург',
      studentName: 'Алексей Сидоров',
      story: 'Поступил на ИСАУ в 2022 году. Рассказали друзья про классный университет. Приеахл и подал документы. Мне повезло, что я попал сюда',
    },
  ]);

  const [searchCity, setSearchCity] = useState('');//поле ввода
  const [mapRef, setMapRef] = useState(null);//ссылка на карту 
  const [activeCity, setActiveCity] = useState(null);//выбранный город
  const [modalVisible, setModalVisible] = useState(false);//видимость модального окна с карточками
  const [storyModalVisible, setStoryModalVisible] = useState(false);//для добавления истории
  const [newStudentName, setNewStudentName] = useState('');//новое имя студента
  const [newStudentStory, setNewStudentStory] = useState('');//история нью студента

  const [groupedByCity, setGroupedByCity] = useState(() =>
    studentsData.reduce((acc, student) => {
      if (!acc[student.cityName]) {
        acc[student.cityName] = {
          coords: student.cityCoords,
          students: [],
        };
      }
      acc[student.cityName].students.push(student);
      return acc;
    }, {})
  );

  useEffect(() => {
    const newGroupedByCity = studentsData.reduce((acc, student) => {
      if (!acc[student.cityName]) {
        acc[student.cityName] = {
          coords: student.cityCoords,
          students: [],
        };
      }
      acc[student.cityName].students.push(student);
      return acc;
    }, {});
    setGroupedByCity(newGroupedByCity);
  }, [studentsData]);

  const initializeCity = (cityName, coords) => {
    setGroupedByCity((prev) => {
      if (!prev[cityName]) {
        return {...prev, [cityName]: {coords: coords, students: [],},};
      }
      return prev;
    });
  };

  const handleDeleteStudent = (id) => {
    setStudentsData((prev) => prev.filter((s) => s.id !== id));
  };

  const handleSaveEdit = (id, newStory) => {
    setStudentsData((prev) =>
      prev.map((s) => (s.id === id ? { ...s, story: newStory } : s))
    );
  };

  const handleSearchCity = async () => {
    if (!searchCity.trim()) return;
    try {
      const res = await fetch(
        `https://geocode-maps.yandex.ru/1.x/?apikey=b2343050-cee3-49d4-a609-f12072e908be&geocode=${encodeURIComponent(
          searchCity
        )}&format=json&results=1`
      );
      const data = await res.json();
      const geoObject = data.response.GeoObjectCollection.featureMember[0]?.GeoObject;

      if (geoObject) {
        const pos = geoObject.Point.pos.split(' ').map(parseFloat);
        const coords = [pos[1], pos[0]];
        const name = geoObject.name;

        if (mapRef) {
          mapRef.setCenter(coords, 10);
        }

        setActiveCity(name);
        initializeCity(name, coords);
        setModalVisible(true);
      } else {
        alert('Город не найден.');
      }
    } catch (error) {
      console.error('Ошибка при геокодировании:', error);
      alert('Ошибка при поиске города');
    }
  };

  const handlePlacemarkClick = (cityName) => {
    setActiveCity(cityName);
    const cityInfo = groupedByCity[cityName] || { coords: [0, 0], students: [] };
    initializeCity(cityName, cityInfo.coords);
    setModalVisible(true);
  };

  const handleMapClick = async (e) => {
    const coords = e.get('coords');
    try {
      const res = await fetch(
        `https://geocode-maps.yandex.ru/1.x/?apikey=b2343050-cee3-49d4-a609-f12072e908be&geocode=${coords[1]},${coords[0]}&format=json&results=1`
      );
      const data = await res.json();
      const geoObject = data.response.GeoObjectCollection.featureMember[0]?.GeoObject;

      if (geoObject) {
        const name = geoObject.name;
        setActiveCity(name);
        initializeCity(name, coords);
        setModalVisible(true);
      } else {
        alert('Город не найден. Попробуйте выбрать другую точку на карте.');
      }
    } catch (error) {
      console.error('Ошибка при геокодировании:', error);
    }
  };

  const handleAddStudent = () => {
    if (!newStudentName.trim() || !newStudentStory.trim()) return;

    if (!activeCity) {
      alert('Сначала выберите город на карте');
      return;
    }

    const cityInfo = groupedByCity[activeCity];
    if (!cityInfo) return;

    const newStudent = {
      id: Date.now(),
      cityCoords: cityInfo.coords,
      cityName: activeCity,
      studentName: newStudentName,
      story: newStudentStory,
    };

    setStudentsData((prev) => [...prev, newStudent]);
    setNewStudentName('');
    setNewStudentStory('');
    setStoryModalVisible(false);
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>Карта студентов с историями</h2>

      <div style={{ marginBottom: 15, maxWidth: 400, display: 'flex', gap: 10 }}>
        <MyInput
          value={searchCity}
          onChange={(e) => setSearchCity(e.target.value)}
          placeholder="Введите название города"
        />
        <MyButton onClick={handleSearchCity}>Найти город</MyButton>
      </div>

      <YMaps query={{ apikey: 'b2343050-cee3-49d4-a609-f12072e908be', lang: 'ru_RU' }}>
        <Map
          defaultState={{ center: [56.740055, 37.225701], zoom: 15 }}
          width="100%"
          height="700px"
          instanceRef={setMapRef}
          onClick={handleMapClick}
        >
          <ZoomControl options={{ float: 'left' }} />
          {Object.entries(groupedByCity).map(([cityName, cityData]) => (
            <Placemark
              key={cityName}
              geometry={cityData.coords}
              properties={{
                hintContent: cityName,
              }}
              onClick={() => handlePlacemarkClick(cityName)}
              options={{
                balloonCloseButton: false,
                hideIconOnBalloonOpen: false,
              }}
            />
          ))}
          <Placemark
          geometry={[56.740055, 37.225701]}
          options={{
            iconColor: 'black',
            iconLayout: 'default#image',
            iconImageHref: 'https://cdn-icons-png.flaticon.com/512/8/8178.png',
            iconImageSize: [60, 62],
            iconImageOffset: [-30, -62],
            }}
            />
            </Map>
      </YMaps>

      {modalVisible && activeCity && (
        <div className="city-modal">
          <div className="modal-header">
            <h3>{activeCity}</h3>
            <button onClick={() => setModalVisible(false)}>X</button>
          </div>
          <div className="modal-content">
            {groupedByCity[activeCity]?.students.map((student) => (
              <StudentCard
                key={student.id}
                student={student}
                onDelete={handleDeleteStudent}
                onSaveEdit={handleSaveEdit}
              />
            ))}
          </div>
          <div style={{ padding: 16, borderTop: '1px solid #eee' }}>
            <MyButton onClick={() => setStoryModalVisible(true)} disabled={!activeCity}>
              Добавить историю
            </MyButton>
          </div>
        </div>
      )}

      {storyModalVisible && (
        <div className="city-modal">
          <div className="modal-header">
            <h3>
              <span style={{ fontFamily: 'Arial, sans-serif' }}>История</span> в город: {activeCity}
            </h3>
            <button onClick={() => setStoryModalVisible(false)}>×</button>
          </div>
          <div className="modal-content" style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <MyInput
              value={newStudentName}
              onChange={(e) => setNewStudentName(e.target.value)}
              placeholder="Имя и фамилия"
              style={{ marginBottom: 0 }}
            />
            <textarea
              value={newStudentStory}
              onChange={(e) => setNewStudentStory(e.target.value)}
              placeholder="История"
              style={{
                marginBottom: 10,
                flex: 1,
                minHeight: '350px',
                width: '100%',
                padding: '8px 12px',
                borderRadius: 4,
                border: '1px solid #ccc',
                fontSize: 16,
                outline: 'none',
                boxSizing: 'border-box',
                resize: 'vertical',
              }}
            />
            <MyButton onClick={handleAddStudent}>Сохранить</MyButton>
          </div>
        </div>
      )}
    </div>
  );
};

export default MapPage;