import { useEffect, useState } from "react";
import {
    IoPlayForwardOutline as ForwardIcon,
    IoPlayBackOutline as BackIcon,
    IoPlaySkipBackOutline as SkipBackIcon,
    IoPlaySkipForwardOutline as SkipForwardIcon,
} from "react-icons/io5";
import { daysInMonth } from "./funct";

// Definición de la interfaz para los datos del calendario
interface CalendarInfo {
    year: number;
    month: number;
    currentDate: Date;
}

// Definición de la interfaz para los datos del día
interface DayInfo {
    day: number;
    isHoliday: boolean;
    isCurrentDay: boolean;
}

// Lista de los meses en español
const MONTHS = [
    "Enero",
    "Febrero",
    "Marzo",
    "Abril",
    "Mayo",
    "Junio",
    "Julio",
    "Agosto",
    "Septiembre",
    "Octubre",
    "Noviembre",
    "Diciembre",
];

// Lista de los días de la semana en español
const DAYS = [
    "Domingo",
    "Lunes",
    "Martes",
    "Miércoles",
    "Jueves",
    "Viernes",
    "Sábado",
];

// Lista de los días festivos
const holidays: { month: number; day: number }[] = [
    { month: 1, day: 1 },
    { month: 2, day: 12 },
    { month: 2, day: 13 },
    { month: 3, day: 24 },
    { month: 3, day: 29 },
    { month: 4, day: 2 },
    { month: 5, day: 1 },
    { month: 5, day: 25 },
    { month: 6, day: 17 },
    { month: 6, day: 20 },
    { month: 7, day: 9 },
    { month: 8, day: 17 },
    { month: 10, day: 12 },
    { month: 11, day: 18 },
    { month: 12, day: 8 },
    { month: 12, day: 25 },
];

// Componente principal de la aplicación
const App = () => {
    // Estado para los datos del calendario
    const [calendarInfo, setCalendarInfo] = useState<CalendarInfo>({
        year: 2024,
        month: 5,
        currentDate: new Date(),
    });
    // Estado para el calendario
    const [calendar, setCalendar] = useState<DayInfo[]>([]);

    // Efecto para actualizar el calendario cuando cambian los datos del calendario
    useEffect(() => {
        // Calcula el primer día del mes
        const firstDay = new Date(
            calendarInfo.year,
            calendarInfo.month - 1,
            (1 - 1) * 7 + 1
        );
        // Crea un array para los días del mes
        let calendarArray: (number | undefined)[] = [
            ...Array(firstDay.getDay()),
            ...[
                ...Array(
                    daysInMonth({
                        year: calendarInfo.year,
                        month: calendarInfo.month,
                    })
                ),
            ].map((_, i) => i + 1),
        ];

        // Asegura que el array tiene al menos 5 semanas
        if (calendarArray.length < 5 * 7) {
            calendarArray = [
                ...calendarArray,
                ...Array(5 * 7 - calendarArray.length),
            ];
        } else if (calendarArray.length > 5 * 7) {
            // Asegura que el array tiene al menos 6 semanas
            calendarArray = [
                ...calendarArray,
                ...Array(6 * 7 - calendarArray.length),
            ];
        }

        // Obtiene el día, mes y año actual
        const day = calendarInfo.currentDate.getDate();
        const month = calendarInfo.currentDate.getMonth() + 1;
        const year = calendarInfo.currentDate.getFullYear();
        // Verifica si el mes del calendario es el mes actual
        const isCurrentMonth =
            calendarInfo.year === year && calendarInfo.month === month;

        const holidaysMonth = holidays.filter(
            (x) => x.month == calendarInfo.month
        );

        // Mapea el array del calendario para marcar los días festivos y el día actual
        // Actualiza el estado del calendario
        setCalendar(
            calendarArray.map((x) => {
                let isHoliday = false;
                if (x === undefined) {
                    return {
                        day: -1,
                        isHoliday,
                        isCurrentDay: false,
                    };
                }

                if (holidaysMonth.length !== 0) {
                    isHoliday =
                        holidaysMonth.filter(({ day }) => day == x).length !==
                        0;
                }

                if (isCurrentMonth && x == day) {
                    // Si es el día actual, marca como tal y no como día festivo
                    return {
                        day: x,
                        isHoliday: isHoliday,
                        isCurrentDay: true,
                    } as DayInfo;
                }
                // Retorna los datos del día
                return {
                    day: x,
                    isHoliday: isHoliday,
                    isCurrentDay: false,
                };
            }) as DayInfo[]
        );
    }, [calendarInfo]);

    const isBusiest = (year: number) => {
        return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
    };

    return (
        <>
            <h1 className="text-center mb-4 text-2xl font-bold text-white underline">
                Calendario Interativo
            </h1>
            <div className="container select-none mx-auto">
                <header className="w-full bg-neutral-600 flex justify-center h-14 gap-4 px-16 items-center text-white text-xl font-medium shadow-lg rounded-lg">
                    <button
                        type="button"
                        onClick={() => {
                            setCalendarInfo((x) => ({
                                ...x,
                                year: x.year - 1,
                            }));
                        }}
                    >
                        <BackIcon className="size-7" />
                    </button>
                    <button
                        type="button"
                        onClick={() => {
                            setCalendarInfo((x) => {
                                const month = x.month - 1;
                                if (month < 1) {
                                    return {
                                        ...x,
                                        month: 12,
                                        year: x.year - 1,
                                    };
                                }
                                return { ...x, month };
                            });
                        }}
                    >
                        <SkipBackIcon className="size-7" />
                    </button>
                    <span className="flex-1 text-center">
                        {MONTHS[calendarInfo.month - 1]},
                        {` ${calendarInfo.year} ${
                            isBusiest(calendarInfo.year)
                                ? "es un año bisiesto"
                                : "no es un año bisiesto"
                        }`}
                    </span>
                    <button
                        type="button"
                        onClick={() => {
                            setCalendarInfo((x) => {
                                const month = x.month + 1;
                                if (month > 12) {
                                    return { ...x, month: 0, year: x.year + 1 };
                                }
                                return { ...x, month };
                            });
                        }}
                    >
                        <SkipForwardIcon className="size-7" />
                    </button>
                    <button
                        type="button"
                        onClick={() => {
                            setCalendarInfo((x) => ({
                                ...x,
                                year: x.year + 1,
                            }));
                        }}
                    >
                        <ForwardIcon className="size-7" />
                    </button>
                </header>
                <main className="bg-neutral-500 shadow-lg rounded-lg mt-4 flex flex-col justify-center items-center py-4">
                    <div className="grid grid-cols-7 p-4 gap-4 ">
                        {DAYS.map((x, i) => (
                            <div
                                key={i}
                                className="flex justify-center font-bold items-center text-white text-xl"
                            >
                                {x[0]}
                            </div>
                        ))}
                        {calendar.map(({ day, isHoliday, isCurrentDay }, i) => {
                            let className = "";
                            if (isHoliday && isCurrentDay) {
                                className +=
                                    "border-4 rounded-full border-red-500 bg-blue-500";
                            } else if (isHoliday) {
                                className +=
                                    "border-4 rounded-full border-red-500";
                            } else if (isCurrentDay) {
                                className +=
                                    "border-4 rounded-full border-blue-500";
                            }
                            return (
                                <div
                                    key={i}
                                    className={`size-20 flex justify-center items-center text-gray-300 text-xl ${
                                        isHoliday
                                            ? "border-4 rounded-full border-red-500"
                                            : ""
                                    } ${className}`}
                                >
                                    {day == -1 ? "" : day}
                                </div>
                            );
                        })}
                    </div>
                </main>
            </div>
        </>
    );
};

export default App;
