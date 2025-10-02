import React, { useState, useEffect } from 'react';
import { Calendar, AlertCircle, Phone, Save, List, Plus } from 'lucide-react';

const HealthTracker = () => {
  const [currentDate, setCurrentDate] = useState(new Date().toISOString().split('T')[0]);
  const [showHistory, setShowHistory] = useState(false);
  const [records, setRecords] = useState([]);
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    temp_morning: '',
    temp_noon: '',
    temp_evening: '',
    bp_systolic_am: '',
    bp_diastolic_am: '',
    pulse_am: '',
    bp_systolic_pm: '',
    bp_diastolic_pm: '',
    pulse_pm: '',
    oxygen: '',
    breakfast: '전부',
    lunch: '전부',
    dinner: '전부',
    water_cups: '',
    nausea: '없음',
    vomit_count: '0',
    diarrhea: '없음',
    constipation: '정상',
    urine_color: '연한 노란색',
    urine_amount: '정상',
    mouth: '정상',
    bleeding: '없음',
    breathing: '정상',
    pain: '없음',
    pain_location: '',
    condition: '괜찮음',
    notes: '',
    hospital: '',
    phone: '',
    emergency: ''
  });

  useEffect(() => {
    loadRecords();
  }, []);

  const loadRecords = async () => {
    const saved = localStorage.getItem('health_records');
    if (saved) {
      setRecords(JSON.parse(saved));
    }
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const saveRecord = async () => {
    const newRecords = [formData, ...records];
    setRecords(newRecords);
    localStorage.setItem('health_records', JSON.stringify(newRecords));
    
    alert('저장되었습니다!');
  };

  const isUrgent = () => {
    const temps = [formData.temp_morning, formData.temp_noon, formData.temp_evening]
      .filter(t => t).map(t => parseFloat(t));
    const highTemp = temps.some(t => t >= 38);
    const lowOxygen = formData.oxygen && parseFloat(formData.oxygen) < 95;
    const severeDiarrhea = formData.diarrhea === '5회 이상';
    const breathingIssue = formData.breathing === '심한 호흡곤란';
    
    return highTemp || lowOxygen || severeDiarrhea || breathingIssue;
  };

  if (showHistory) {
    return (
      <div className="max-w-4xl mx-auto p-6 bg-white">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">기록 히스토리</h2>
          <button 
            onClick={() => setShowHistory(false)}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            새 기록 작성
          </button>
        </div>
        
        {records.length === 0 ? (
          <p className="text-gray-500 text-center py-8">아직 기록이 없습니다.</p>
        ) : (
          <div className="space-y-4">
            {records.map((record, idx) => (
              <div key={idx} className="border rounded-lg p-4 hover:shadow-lg transition-shadow">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-bold text-lg">{record.date}</h3>
                  <span className={`px-3 py-1 rounded text-sm ${
                    record.condition === '괜찮음' ? 'bg-green-100 text-green-800' :
                    record.condition === '피곤함' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {record.condition}
                  </span>
                </div>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm">
                  <div>
                    <span className="text-gray-600">체온:</span>
                    <span className="ml-1 font-medium">
                      {[record.temp_morning, record.temp_noon, record.temp_evening]
                        .filter(t => t).join(', ')}°C
                    </span>
                  </div>
                  {record.oxygen && (
                    <div>
                      <span className="text-gray-600">산소:</span>
                      <span className="ml-1 font-medium">{record.oxygen}%</span>
                    </div>
                  )}
                  <div>
                    <span className="text-gray-600">식사:</span>
                    <span className="ml-1">{record.breakfast}, {record.lunch}, {record.dinner}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">수분:</span>
                    <span className="ml-1">{record.water_cups}컵</span>
                  </div>
                </div>
                
                {record.notes && (
                  <div className="mt-2 pt-2 border-t">
                    <p className="text-sm text-gray-700">{record.notes}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-blue-600">항암치료 건강 체크</h1>
        <button 
          onClick={() => setShowHistory(true)}
          className="flex items-center gap-2 px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
        >
          <List size={20} />
          기록 보기
        </button>
      </div>

      {isUrgent() && (
        <div className="mb-6 p-4 bg-red-50 border-2 border-red-500 rounded-lg flex items-start gap-3">
          <AlertCircle className="text-red-500 flex-shrink-0 mt-1" />
          <div>
            <h3 className="font-bold text-red-700 mb-1">⚠️ 주의 필요</h3>
            <p className="text-red-600 text-sm">체크된 수치가 위험 범위입니다. 병원에 연락하세요.</p>
          </div>
        </div>
      )}

      <div className="mb-6 p-4 bg-blue-50 rounded-lg flex items-center gap-2">
        <Calendar className="text-blue-600" />
        <input 
          type="date" 
          value={formData.date}
          onChange={(e) => handleInputChange('date', e.target.value)}
          className="px-3 py-2 border rounded"
        />
      </div>

      {/* 체온 */}
      <section className="mb-6 p-4 border rounded-lg">
        <h2 className="text-xl font-bold mb-4 text-gray-800">🌡️ 체온</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {['morning', 'noon', 'evening'].map((time, idx) => (
            <div key={time}>
              <label className="block text-sm font-medium mb-1">
                {['아침', '점심', '저녁'][idx]}
              </label>
              <div className="flex items-center gap-2">
                <input 
                  type="number" 
                  step="0.1"
                  value={formData[`temp_${time}`]}
                  onChange={(e) => handleInputChange(`temp_${time}`, e.target.value)}
                  className="flex-1 px-3 py-2 border rounded"
                  placeholder="36.5"
                />
                <span className="text-sm">°C</span>
              </div>
            </div>
          ))}
        </div>
        {[formData.temp_morning, formData.temp_noon, formData.temp_evening]
          .some(t => t && parseFloat(t) >= 38) && (
          <p className="mt-2 text-red-600 text-sm font-medium">⚠️ 38°C 이상 - 즉시 병원 연락!</p>
        )}
      </section>

      {/* 혈압 & 맥박 */}
      <section className="mb-6 p-4 border rounded-lg">
        <h2 className="text-xl font-bold mb-4 text-gray-800">💓 혈압 & 맥박</h2>
        {['am', 'pm'].map((period) => (
          <div key={period} className="mb-4">
            <h3 className="font-medium mb-2">{period === 'am' ? '아침' : '저녁'}</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm mb-1">수축기</label>
                <input 
                  type="number"
                  value={formData[`bp_systolic_${period}`]}
                  onChange={(e) => handleInputChange(`bp_systolic_${period}`, e.target.value)}
                  className="w-full px-3 py-2 border rounded"
                  placeholder="120"
                />
              </div>
              <div>
                <label className="block text-sm mb-1">이완기</label>
                <input 
                  type="number"
                  value={formData[`bp_diastolic_${period}`]}
                  onChange={(e) => handleInputChange(`bp_diastolic_${period}`, e.target.value)}
                  className="w-full px-3 py-2 border rounded"
                  placeholder="80"
                />
              </div>
              <div>
                <label className="block text-sm mb-1">맥박 (회/분)</label>
                <input 
                  type="number"
                  value={formData[`pulse_${period}`]}
                  onChange={(e) => handleInputChange(`pulse_${period}`, e.target.value)}
                  className="w-full px-3 py-2 border rounded"
                  placeholder="70"
                />
              </div>
            </div>
          </div>
        ))}
      </section>

      {/* 산소포화도 */}
      <section className="mb-6 p-4 border rounded-lg">
        <h2 className="text-xl font-bold mb-4 text-gray-800">🫁 산소포화도</h2>
        <div className="flex items-center gap-2">
          <input 
            type="number"
            value={formData.oxygen}
            onChange={(e) => handleInputChange('oxygen', e.target.value)}
            className="w-32 px-3 py-2 border rounded"
            placeholder="98"
          />
          <span>%</span>
        </div>
        {formData.oxygen && parseFloat(formData.oxygen) < 95 && (
          <p className="mt-2 text-red-600 text-sm font-medium">⚠️ 95% 미만 - 병원 연락!</p>
        )}
      </section>

      {/* 식사 & 수분 */}
      <section className="mb-6 p-4 border rounded-lg">
        <h2 className="text-xl font-bold mb-4 text-gray-800">🍚 식사 & 수분</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          {['breakfast', 'lunch', 'dinner'].map((meal, idx) => (
            <div key={meal}>
              <label className="block text-sm font-medium mb-1">
                {['아침', '점심', '저녁'][idx]}
              </label>
              <select 
                value={formData[meal]}
                onChange={(e) => handleInputChange(meal, e.target.value)}
                className="w-full px-3 py-2 border rounded"
              >
                <option>전부</option>
                <option>반 이상</option>
                <option>반 이하</option>
                <option>거의 못 먹음</option>
              </select>
            </div>
          ))}
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">수분 섭취 (컵)</label>
          <input 
            type="number"
            value={formData.water_cups}
            onChange={(e) => handleInputChange('water_cups', e.target.value)}
            className="w-32 px-3 py-2 border rounded"
            placeholder="6-8"
          />
          <span className="ml-2 text-sm text-gray-600">목표: 6-8컵</span>
        </div>
      </section>

      {/* 증상 체크 */}
      <section className="mb-6 p-4 border rounded-lg">
        <h2 className="text-xl font-bold mb-4 text-gray-800">💊 증상 체크</h2>
        
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">메스꺼움</label>
              <select 
                value={formData.nausea}
                onChange={(e) => handleInputChange('nausea', e.target.value)}
                className="w-full px-3 py-2 border rounded"
              >
                <option>없음</option>
                <option>약함</option>
                <option>중간</option>
                <option>심함</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">구토 횟수</label>
              <input 
                type="number"
                value={formData.vomit_count}
                onChange={(e) => handleInputChange('vomit_count', e.target.value)}
                className="w-full px-3 py-2 border rounded"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">설사</label>
              <select 
                value={formData.diarrhea}
                onChange={(e) => handleInputChange('diarrhea', e.target.value)}
                className="w-full px-3 py-2 border rounded"
              >
                <option>없음</option>
                <option>1-2회</option>
                <option>3-4회</option>
                <option>5회 이상</option>
              </select>
              {formData.diarrhea === '5회 이상' && (
                <p className="mt-1 text-red-600 text-sm">⚠️ 병원 연락 필요</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">변비</label>
              <select 
                value={formData.constipation}
                onChange={(e) => handleInputChange('constipation', e.target.value)}
                className="w-full px-3 py-2 border rounded"
              >
                <option>정상</option>
                <option>2일째</option>
                <option>3일 이상</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">소변 색깔</label>
              <select 
                value={formData.urine_color}
                onChange={(e) => handleInputChange('urine_color', e.target.value)}
                className="w-full px-3 py-2 border rounded"
              >
                <option>연한 노란색</option>
                <option>진한 노란색</option>
                <option>갈색</option>
                <option>붉은색</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">소변 양</label>
              <select 
                value={formData.urine_amount}
                onChange={(e) => handleInputChange('urine_amount', e.target.value)}
                className="w-full px-3 py-2 border rounded"
              >
                <option>정상</option>
                <option>적음</option>
                <option>매우 적음</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">입안 상태</label>
              <select 
                value={formData.mouth}
                onChange={(e) => handleInputChange('mouth', e.target.value)}
                className="w-full px-3 py-2 border rounded"
              >
                <option>정상</option>
                <option>따끔거림</option>
                <option>염증/궤양</option>
                <option>통증으로 식사 어려움</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">출혈</label>
              <select 
                value={formData.bleeding}
                onChange={(e) => handleInputChange('bleeding', e.target.value)}
                className="w-full px-3 py-2 border rounded"
              >
                <option>없음</option>
                <option>코피</option>
                <option>잇몸출혈</option>
                <option>멍</option>
                <option>기타</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">호흡</label>
              <select 
                value={formData.breathing}
                onChange={(e) => handleInputChange('breathing', e.target.value)}
                className="w-full px-3 py-2 border rounded"
              >
                <option>정상</option>
                <option>약간 답답함</option>
                <option>숨참</option>
                <option>심한 호흡곤란</option>
              </select>
              {formData.breathing === '심한 호흡곤란' && (
                <p className="mt-1 text-red-600 text-sm">⚠️ 즉시 병원 연락!</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">통증</label>
              <select 
                value={formData.pain}
                onChange={(e) => handleInputChange('pain', e.target.value)}
                className="w-full px-3 py-2 border rounded"
              >
                <option>없음</option>
                <option>약함</option>
                <option>중간</option>
                <option>심함</option>
              </select>
            </div>
          </div>

          {formData.pain !== '없음' && (
            <div>
              <label className="block text-sm font-medium mb-1">통증 부위</label>
              <input 
                type="text"
                value={formData.pain_location}
                onChange={(e) => handleInputChange('pain_location', e.target.value)}
                className="w-full px-3 py-2 border rounded"
                placeholder="예: 배, 머리, 가슴 등"
              />
            </div>
          )}

          <div>
            <label className="block text-sm font-medium mb-1">전체 컨디션</label>
            <select 
              value={formData.condition}
              onChange={(e) => handleInputChange('condition', e.target.value)}
              className="w-full px-3 py-2 border rounded"
            >
              <option>괜찮음</option>
              <option>피곤함</option>
              <option>매우 피곤함</option>
              <option>어지러움</option>
              <option>의식 흐릿함</option>
            </select>
          </div>
        </div>
      </section>

      {/* 특이사항 */}
      <section className="mb-6 p-4 border rounded-lg">
        <h2 className="text-xl font-bold mb-4 text-gray-800">📝 오늘의 특이사항</h2>
        <textarea 
          value={formData.notes}
          onChange={(e) => handleInputChange('notes', e.target.value)}
          className="w-full px-3 py-2 border rounded"
          rows="4"
          placeholder="특이사항이나 추가로 기록할 내용을 입력하세요..."
        />
      </section>

      {/* 긴급 연락처 */}
      <section className="mb-6 p-4 border rounded-lg bg-red-50">
        <h2 className="text-xl font-bold mb-4 text-gray-800 flex items-center gap-2">
          <Phone className="text-red-600" />
          긴급 연락처
        </h2>
        <div className="space-y-3">
          <div>
            <label className="block text-sm font-medium mb-1">담당 병원</label>
            <input 
              type="text"
              value={formData.hospital}
              onChange={(e) => handleInputChange('hospital', e.target.value)}
              className="w-full px-3 py-2 border rounded"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">전화번호</label>
            <input 
              type="tel"
              value={formData.phone}
              onChange={(e) => handleInputChange('phone', e.target.value)}
              className="w-full px-3 py-2 border rounded"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">응급실</label>
            <input 
              type="tel"
              value={formData.emergency}
              onChange={(e) => handleInputChange('emergency', e.target.value)}
              className="w-full px-3 py-2 border rounded"
            />
          </div>
        </div>
      </section>

      {/* 저장 버튼 */}
      <div className="flex justify-center">
        <button 
          onClick={saveRecord}
          className="flex items-center gap-2 px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-lg font-medium"
        >
          <Save size={24} />
          저장하기
        </button>
      </div>
    </div>
  );
};

export default HealthTracker;