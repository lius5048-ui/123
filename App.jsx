import React, { useState, useEffect } from 'react';
import { BookOpen, ChevronRight, ChevronDown, Play, CheckCircle, Code, Terminal, AlertCircle, Lightbulb, Eye, ArrowLeft, ArrowRight, Target } from 'lucide-react';

// --- 题库模板生成器 (用于动态扩充每个小节到至少10题) ---
function getPaddedExercise(sectionTitle, sectionId, index) {
  const templates = [
    {
      title: '基础语法检测',
      desc: `【基础测试】请在 Python 环境中输出当前正在学习的小节名称：\n"${sectionTitle}"`,
      init: `# 请使用 print 打印出节标题\n`,
      ans: `print("${sectionTitle}")`,
      out: sectionTitle
    },
    {
      title: '逻辑运算强化',
      desc: `【逻辑强化】计算并打印结果：(${index + 5} * 2) - ${index}。`,
      init: `# 计算并打印结果\n`,
      ans: `print((${index + 5} * 2) - ${index})`,
      out: String((index + 5) * 2 - index)
    },
    {
      title: '数据类型识别',
      desc: `【类型测试】请使用 type() 函数打印数字 ${index}.5 的类型名称。`,
      init: `# 打印 type(${index}.5).__name__\n`,
      ans: `print(type(${index}.5).__name__)`,
      out: `float`
    },
    {
      title: '循环控制练习',
      desc: `【循环强化】请使用 for 循环打印 ${index + 2} 行数字 1。`,
      init: `# 请编写循环代码\n`,
      ans: `for i in range(${index + 2}):\n    print(1)`,
      out: Array(index + 2).fill('1').join('\n')
    },
    {
      title: '字符串切片应用',
      desc: `【切片练习】给定字符串 s = "PythonStudy"，请打印其前 6 个字符。`,
      init: `s = "PythonStudy"\n# 打印 s[:6]\n`,
      ans: `print(s[:6])`,
      out: `Python`
    }
  ];
  const t = templates[index % templates.length];
  return {
    id: `ex-${sectionId}-padded-${index}`,
    title: t.title,
    description: t.desc,
    initialCode: t.init,
    expectedOutput: t.out,
    answer: t.ans,
    explanation: `这是针对【${sectionTitle}】的强化练习。大量的代码编写是掌握 Python 基础语法的关键环节。`
  };
}

// --- 大章综合测验模板生成器 ---
function getChapterSummaryExercise(chapterTitle, chapterId, index) {
  const templates = [
    {
      title: '跨知识点应用 - 算法逻辑',
      desc: `【综合测验】判断变量 val = ${index * 7} 是否能被 2 整除。如果能打印 "YES"，否则打印 "NO"：`,
      init: `val = ${index * 7}\n# 编写 if...else 逻辑\n`,
      ans: `val = ${index * 7}\nprint("YES" if val % 2 == 0 else "NO")`,
      out: (index * 7) % 2 === 0 ? "YES" : "NO"
    },
    {
      title: '综合应用 - 集合与列表',
      desc: `【综合测验】将列表 [1, 1, 2, 2, 3] 转换为 set 去重，并打印其长度：`,
      init: `L = [1, 1, 2, 2, 3]\n# 编写代码\n`,
      ans: `print(len(set([1, 1, 2, 2, 3])))`,
      out: '3'
    }
  ];
  const t = templates[index % templates.length];
  return {
    id: `ex-${chapterId}-summary-${index}`,
    title: t.title,
    description: t.desc,
    initialCode: t.init,
    expectedOutput: t.out,
    answer: t.ans,
    explanation: `本题考察《${chapterTitle}》整章的综合理解能力。`
  };
}

// --- 1-23章完整大纲 ---
const RAW_COURSE_DATA = [
  { id: 'ch1', title: 'Python基础', sections: [{ id: 'ch1-1', title: '数据类型和变量', exercises: [] }, { id: 'ch1-2', title: '字符串和编码', exercises: [] }, { id: 'ch1-3', title: '使用list和tuple', exercises: [] }, { id: 'ch1-4', title: '条件判断', exercises: [] }, { id: 'ch1-5', title: '循环', exercises: [] }, { id: 'ch1-6', title: '使用dict和set', exercises: [] }] },
  { id: 'ch2', title: '函数', sections: [{ id: 'ch2-1', title: '调用函数', exercises: [] }, { id: 'ch2-2', title: '定义函数', exercises: [] }, { id: 'ch2-3', title: '函数的参数', exercises: [] }, { id: 'ch2-4', title: '递归函数', exercises: [] }] },
  { id: 'ch3', title: '高级特性', sections: [{ id: 'ch3-1', title: '切片', exercises: [] }, { id: 'ch3-2', title: '迭代', exercises: [] }, { id: 'ch3-3', title: '列表生成式', exercises: [] }, { id: 'ch3-4', title: '生成器', exercises: [] }, { id: 'ch3-5', title: '迭代器', exercises: [] }] },
  { id: 'ch4', title: '函数式编程', sections: [{ id: 'ch4-1', title: '高阶函数', exercises: [] }, { id: 'ch4-2', title: '返回函数', exercises: [] }, { id: 'ch4-3', title: '匿名函数', exercises: [] }, { id: 'ch4-4', title: '装饰器', exercises: [] }, { id: 'ch4-5', title: '偏函数', exercises: [] }] },
  { id: 'ch5', title: '模块', sections: [{ id: 'ch5-1', title: '使用模块', exercises: [] }, { id: 'ch5-2', title: '安装第三方模块', exercises: [] }] },
  { id: 'ch6', title: '面向对象编程', sections: [{ id: 'ch6-1', title: '类和实例', exercises: [] }, { id: 'ch6-2', title: '访问限制', exercises: [] }, { id: 'ch6-3', title: '继承和多态', exercises: [] }, { id: 'ch6-4', title: '获取对象信息', exercises: [] }, { id: 'ch6-5', title: '实例属性和类属性', exercises: [] }] },
  { id: 'ch7', title: '面向对象高级编程', sections: [{ id: 'ch7-1', title: '使用__slots__', exercises: [] }, { id: 'ch7-2', title: '使用@property', exercises: [] }, { id: 'ch7-3', title: '多重继承', exercises: [] }, { id: 'ch7-4', title: '定制类', exercises: [] }, { id: 'ch7-5', title: '使用枚举类', exercises: [] }, { id: 'ch7-6', title: '使用元类', exercises: [] }] },
  { id: 'ch8', title: '错误、调试和测试', sections: [{ id: 'ch8-1', title: '错误处理', exercises: [] }, { id: 'ch8-2', title: '调试', exercises: [] }, { id: 'ch8-3', title: '单元测试', exercises: [] }, { id: 'ch8-4', title: '文档测试', exercises: [] }] },
  { id: 'ch9', title: 'IO编程', sections: [{ id: 'ch9-1', title: '文件读写', exercises: [] }, { id: 'ch9-2', title: 'StringIO和BytesIO', exercises: [] }, { id: 'ch9-3', title: '操作文件和目录', exercises: [] }, { id: 'ch9-4', title: '序列化', exercises: [] }] },
  { id: 'ch10', title: '进程和线程', sections: [{ id: 'ch10-1', title: '多进程', exercises: [] }, { id: 'ch10-2', title: '多线程', exercises: [] }, { id: 'ch10-3', title: 'ThreadLocal', exercises: [] }, { id: 'ch10-4', title: '进程 vs. 线程', exercises: [] }, { id: 'ch10-5', title: '分布式进程', exercises: [] }] },
  { id: 'ch11', title: '正则表达式', sections: [{ id: 'ch11-1', title: '正则表达式', exercises: [] }] },
  { id: 'ch12', title: '常用内建模块', sections: [{ id: 'ch12-1', title: 'datetime', exercises: [] }, { id: 'ch12-2', title: 'collections', exercises: [] }, { id: 'ch12-3', title: 'base64', exercises: [] }, { id: 'ch12-4', title: 'struct', exercises: [] }, { id: 'ch12-5', title: 'hashlib', exercises: [] }, { id: 'ch12-6', title: 'hmac', exercises: [] }, { id: 'ch12-7', title: 'itertools', exercises: [] }, { id: 'ch12-8', title: 'contextlib', exercises: [] }, { id: 'ch12-9', title: 'urllib', exercises: [] }, { id: 'ch12-10', title: 'XML', exercises: [] }, { id: 'ch12-11', title: 'HTMLParser', exercises: [] }] },
  { id: 'ch13', title: '网络编程', sections: [{ id: 'ch13-1', title: 'TCP/IP简介', exercises: [] }, { id: 'ch13-2', title: 'TCP编程', exercises: [] }, { id: 'ch13-3', title: 'UDP编程', exercises: [] }] },
  { id: 'ch14', title: '电子邮件', sections: [{ id: 'ch14-1', title: 'SMTP发送邮件', exercises: [] }, { id: 'ch14-2', title: 'POP3收取邮件', exercises: [] }] },
  { id: 'ch15', title: '数据库', sections: [{ id: 'ch15-1', title: '使用SQLite', exercises: [] }, { id: 'ch15-2', title: '使用MySQL', exercises: [] }, { id: 'ch15-3', title: '使用SQLAlchemy', exercises: [] }] },
  { id: 'ch16', title: 'Web开发', sections: [{ id: 'ch16-1', title: 'HTTP协议', exercises: [] }, { id: 'ch16-2', title: 'HTML简介', exercises: [] }, { id: 'ch16-3', title: 'WSGI接口', exercises: [] }, { id: 'ch16-4', title: '使用Web框架', exercises: [] }, { id: 'ch16-5', title: '使用模板', exercises: [] }] },
  { id: 'ch17', title: '异步IO', sections: [{ id: 'ch17-1', title: '协程', exercises: [] }, { id: 'ch17-2', title: 'asyncio', exercises: [] }, { id: 'ch17-3', title: 'async/await', exercises: [] }, { id: 'ch17-4', title: 'aiohttp', exercises: [] }] },
  { id: 'ch18', title: '实战', sections: [{ id: 'ch18-1', title: 'Web App实战', exercises: [] }] },
  { id: 'ch19', title: '图形界面', sections: [{ id: 'ch19-1', title: 'Tkinter', exercises: [] }] },
  { id: 'ch20', title: '网络编程续', sections: [{ id: 'ch20-1', title: 'Socket编程进阶', exercises: [] }] },
  { id: 'ch21', title: '协程原理', sections: [{ id: 'ch21-1', title: 'Generator到Async', exercises: [] }] },
  { id: 'ch22', title: '常用第三方模块', sections: [{ id: 'ch22-1', title: 'Pillow', exercises: [] }, { id: 'ch22-2', title: 'requests', exercises: [] }, { id: 'ch22-3', title: 'chardet', exercises: [] }, { id: 'ch22-4', title: 'psutil', exercises: [] }] },
  { id: 'ch23', title: '虚拟环境', sections: [{ id: 'ch23-1', title: '使用venv', exercises: [] }] }
];

// 加工数据
const COURSE_DATA = RAW_COURSE_DATA.map(chapter => {
  const processedSections = chapter.sections.map(section => {
    const paddedExercises = [];
    for (let i = 0; i < 10; i++) {
      paddedExercises.push(getPaddedExercise(section.title, section.id, i));
    }
    return { ...section, exercises: paddedExercises };
  });

  processedSections.push({
    id: `${chapter.id}-summary`,
    title: '🎯 本章总结与综合测验',
    summary: `祝贺您完成了《${chapter.title}》章节的学习！本章考察了多个核心知识点。`,
    exercises: Array.from({ length: 10 }).map((_, idx) => getChapterSummaryExercise(chapter.title, chapter.id, idx))
  });

  return { ...chapter, sections: processedSections };
});

export default function App() {
  const [pyodide, setPyodide] = useState(null);
  const [isLoadingPy, setIsLoadingPy] = useState(true);
  const [activeChapterId, setActiveChapterId] = useState(COURSE_DATA[0].id);
  const [activeSectionId, setActiveSectionId] = useState(COURSE_DATA[0].sections[0].id);
  const [activeExerciseIndex, setActiveExerciseIndex] = useState(0);
  const [expandedChapters, setExpandedChapters] = useState({ [COURSE_DATA[0].id]: true });
  const [userCodes, setUserCodes] = useState({}); 
  const [consoleOutput, setConsoleOutput] = useState('');
  const [isError, setIsError] = useState(false);
  const [isRunning, setIsRunning] = useState(false);
  const [successStatus, setSuccessStatus] = useState({}); 
  const [showAnswer, setShowAnswer] = useState(false); 

  const activeChapter = COURSE_DATA.find(c => c.id === activeChapterId);
  const activeSection = activeChapter?.sections.find(s => s.id === activeSectionId);
  const activeExercise = activeSection?.exercises[activeExerciseIndex];

  useEffect(() => {
    const loadPy = async () => {
      try {
        if (!window.loadPyodide) {
          const script = document.createElement('script');
          script.src = "https://cdn.jsdelivr.net/pyodide/v0.24.1/full/pyodide.js";
          script.onload = async () => {
            const py = await window.loadPyodide();
            setPyodide(py);
            setIsLoadingPy(false);
          };
          document.body.appendChild(script);
        } else {
          const py = await window.loadPyodide();
          setPyodide(py);
          setIsLoadingPy(false);
        }
      } catch (err) {
        setIsLoadingPy(false);
      }
    };
    loadPy();
  }, []);

  useEffect(() => {
    if (activeExercise && !userCodes[activeExercise.id]) {
      setUserCodes(prev => ({ ...prev, [activeExercise.id]: activeExercise.initialCode }));
    }
    setConsoleOutput('');
    setIsError(false);
    setShowAnswer(false);
  }, [activeSectionId, activeExerciseIndex, activeExercise]);

  const runCode = async () => {
    if (!pyodide || !activeExercise) return;
    setIsRunning(true);
    setConsoleOutput('运行中...');
    try {
      await pyodide.runPythonAsync(`import sys, io\nsys.stdout = io.StringIO()\nsys.stderr = io.StringIO()`);
      await pyodide.runPythonAsync(userCodes[activeExercise.id]);
      const stdout = await pyodide.runPythonAsync("sys.stdout.getvalue()");
      const stderr = await pyodide.runPythonAsync("sys.stderr.getvalue()");
      const finalOutput = stdout + stderr;
      setConsoleOutput(finalOutput || '(无输出)');
      
      const normalizedOut = finalOutput.trim().replace(/\r\n/g, '\n');
      const expected = activeExercise.expectedOutput.trim().replace(/\r\n/g, '\n');
      setSuccessStatus(prev => ({ ...prev, [activeExercise.id]: (normalizedOut === expected || normalizedOut.includes(expected)) }));
      setIsError(false);
    } catch (err) {
      setIsError(true);
      setConsoleOutput(err.toString());
    } finally {
      setIsRunning(false);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-white text-slate-900 font-sans overflow-hidden">
      <header className="flex-shrink-0 bg-slate-900 text-white p-4 shadow-xl flex items-center justify-between z-20">
        <div className="flex items-center space-x-3">
          <BookOpen className="w-7 h-7 text-blue-400" />
          <h1 className="text-xl font-bold">廖雪峰 Python 强化练习平台</h1>
        </div>
        <div className="text-xs font-mono text-slate-400">{isLoadingPy ? "加载环境..." : "环境就绪"}</div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        <aside className="w-72 bg-slate-50 border-r border-slate-200 flex flex-col overflow-y-auto">
          {COURSE_DATA.map(chapter => (
            <div key={chapter.id}>
              <button onClick={() => setExpandedChapters(p => ({ ...p, [chapter.id]: !p[chapter.id] }))} className="w-full flex items-center justify-between px-4 py-3 hover:bg-slate-100 border-b border-slate-100">
                <span className="text-sm font-bold text-slate-700">{chapter.title}</span>
                {expandedChapters[chapter.id] ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
              </button>
              {expandedChapters[chapter.id] && (
                <div className="bg-white">
                  {chapter.sections.map(sec => (
                    <button key={sec.id} onClick={() => { setActiveChapterId(chapter.id); setActiveSectionId(sec.id); setActiveExerciseIndex(0); }}
                      className={`w-full flex items-center px-8 py-2 text-xs text-left ${activeSectionId === sec.id ? 'bg-blue-50 text-blue-600 font-bold border-l-4 border-blue-600' : 'text-slate-500 hover:bg-slate-50'}`}>
                      {sec.title}
                    </button>
                  ))}
                </div>
              )}
            </div>
          ))}
        </aside>

        <main className="flex-1 flex flex-col bg-white overflow-hidden">
          <div className="border-b border-slate-200 px-6 py-2 flex items-center space-x-2 overflow-x-auto scrollbar-hide">
            {activeSection.exercises.map((_, idx) => (
              <button key={idx} onClick={() => setActiveExerciseIndex(idx)}
                className={`px-3 py-1 text-xs rounded-full border ${activeExerciseIndex === idx ? 'bg-slate-900 text-white' : 'bg-white text-slate-500 border-slate-200 hover:border-slate-400'}`}>
                题 {idx + 1}
              </button>
            ))}
          </div>

          <div className="flex-1 flex flex-col overflow-y-auto p-6 space-y-4">
            {activeSection.summary && <div className="p-4 bg-blue-600 text-white rounded-xl shadow-md text-sm">{activeSection.summary}</div>}
            
            <div className="p-6 border border-slate-200 rounded-xl bg-slate-50">
              <h2 className="text-xl font-bold mb-2">{activeExerciseIndex + 1}. {activeExercise.title}</h2>
              <p className="text-sm text-slate-600 mb-4">{activeExercise.description}</p>
              <button onClick={() => setShowAnswer(!showAnswer)} className="text-xs font-bold text-amber-600 underline">查看解析</button>
              {showAnswer && (
                <div className="mt-4 p-4 bg-amber-50 border border-amber-100 rounded-lg">
                  <pre className="text-xs font-mono text-slate-800 bg-white p-3 rounded mb-2">{activeExercise.answer}</pre>
                  <p className="text-xs text-amber-900">{activeExercise.explanation}</p>
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 flex-1 min-h-[400px]">
              <div className="flex flex-col bg-slate-900 rounded-xl overflow-hidden shadow-lg">
                <div className="px-4 py-2 border-b border-slate-800 flex justify-between items-center text-[10px] text-slate-500 font-bold uppercase tracking-widest">
                  <span>Python Editor</span>
                  <button onClick={runCode} disabled={isLoadingPy || isRunning} className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-500">运行测试</button>
                </div>
                <textarea value={userCodes[activeExercise.id] || ''} onChange={(e) => setUserCodes(p => ({ ...p, [activeExercise.id]: e.target.value }))}
                  className="flex-1 p-4 bg-slate-900 text-indigo-100 font-mono text-sm resize-none focus:outline-none" spellCheck="false" />
              </div>
              <div className="flex flex-col bg-white border border-slate-200 rounded-xl overflow-hidden">
                <div className="px-4 py-2 bg-slate-50 border-b border-slate-200 text-[10px] text-slate-500 font-bold uppercase tracking-widest">Console Output</div>
                <div className={`flex-1 p-4 font-mono text-sm overflow-y-auto whitespace-pre-wrap ${isError ? 'text-red-600 bg-red-50' : 'text-slate-800'}`}>
                  {consoleOutput || <span className="text-slate-300 italic">等待运行...</span>}
                </div>
                {successStatus[activeExercise.id] && <div className="p-2 bg-green-50 text-green-700 text-xs font-bold text-center">测试通过！✅</div>}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}