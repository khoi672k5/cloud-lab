import { useEffect, useState } from "react";

function App() {
    const [students, setStudents] = useState([]);
    const [studentId, setStudentId] = useState("");
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");

    const [editingId, setEditingId] = useState(null);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [message, setMessage] = useState("");

    const API_URL =
        "https://fantastic-guacamole-7vvvwq69769hxwj9-5000.app.github.dev";

    // ================================
    // GET - Lấy danh sách sinh viên
    // ================================
    const fetchStudents = () => {
        fetch(`${API_URL}/api/students`)
            .then((response) => {
                if (!response.ok) {
                    throw new Error(
                        "Không thể lấy danh sách sinh viên"
                    );
                }

                return response.json();
            })
            .then((data) => {
                setStudents(data);
                setLoading(false);
            })
            .catch((error) => {
                console.error(error);
                setError(error.message);
                setLoading(false);
            });
    };

    useEffect(() => {
        fetchStudents();
    }, []);

    // ================================
    // Sửa sinh viên
    // ================================
    const handleEdit = (student) => {
        setEditingId(student._id);
        setStudentId(student.studentId);
        setName(student.name);
        setEmail(student.email);

        setMessage("");
        setError("");
    };

    // ================================
    // Hủy sửa
    // ================================
    const handleCancel = () => {
        setEditingId(null);
        setStudentId("");
        setName("");
        setEmail("");

        setMessage("");
        setError("");
    };

    // ================================
    // POST - Thêm
    // PUT - Cập nhật
    // ================================
    const handleSubmit = async (event) => {
        event.preventDefault();

        setError("");
        setMessage("");

        try {
            let response;

            if (editingId) {
                // PUT cập nhật
                response = await fetch(
                    `${API_URL}/api/students/${editingId}`,
                    {
                        method: "PUT",
                        headers: {
                            "Content-Type": "application/json"
                        },
                        body: JSON.stringify({
                            studentId,
                            name,
                            email
                        })
                    }
                );
            } else {
                // POST thêm
                response = await fetch(
                    `${API_URL}/api/students`,
                    {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json"
                        },
                        body: JSON.stringify({
                            studentId,
                            name,
                            email
                        })
                    }
                );
            }

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data.message || "Có lỗi xảy ra"
                );
            }

            if (editingId) {
                setMessage(
                    "Cập nhật sinh viên thành công!"
                );
            } else {
                setMessage(
                    "Thêm sinh viên thành công!"
                );
            }

            setEditingId(null);
            setStudentId("");
            setName("");
            setEmail("");

            fetchStudents();

        } catch (error) {
            console.error(error);
            setError(error.message);
        }
    };

    // ================================
    // DELETE - Xóa sinh viên
    // ================================
    const handleDelete = async (id) => {
        const confirmDelete = window.confirm(
            "Bạn có chắc muốn xóa sinh viên này không?"
        );

        if (!confirmDelete) {
            return;
        }

        setError("");
        setMessage("");

        try {
            const response = await fetch(
                `${API_URL}/api/students/${id}`,
                {
                    method: "DELETE"
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data.message || "Không thể xóa sinh viên"
                );
            }

            setMessage(
                "Xóa sinh viên thành công!"
            );

            // Nếu đang sửa sinh viên vừa xóa
            if (editingId === id) {
                setEditingId(null);
                setStudentId("");
                setName("");
                setEmail("");
            }

            // Cập nhật lại danh sách
            fetchStudents();

        } catch (error) {
            console.error(error);
            setError(error.message);
        }
    };

    return (
        <div
            style={{
                maxWidth: "900px",
                margin: "40px auto",
                fontFamily: "Arial, sans-serif",
                padding: "20px"
            }}
        >
            <h1>Quản lý sinh viên</h1>

            {/* ================================
                FORM
            ================================= */}
            <h2>
                {editingId
                    ? "Cập nhật sinh viên"
                    : "Thêm sinh viên"}
            </h2>

            <form onSubmit={handleSubmit}>

                {/* MSSV */}
                <div style={{ marginBottom: "15px" }}>
                    <label>MSSV:</label>
                    <br />

                    <input
                        type="text"
                        value={studentId}
                        onChange={(event) =>
                            setStudentId(
                                event.target.value
                            )
                        }
                        required
                        style={{
                            width: "100%",
                            padding: "10px",
                            marginTop: "5px"
                        }}
                    />
                </div>

                {/* Họ tên */}
                <div style={{ marginBottom: "15px" }}>
                    <label>Họ tên:</label>
                    <br />

                    <input
                        type="text"
                        value={name}
                        onChange={(event) =>
                            setName(
                                event.target.value
                            )
                        }
                        required
                        style={{
                            width: "100%",
                            padding: "10px",
                            marginTop: "5px"
                        }}
                    />
                </div>

                {/* Email */}
                <div style={{ marginBottom: "15px" }}>
                    <label>Email:</label>
                    <br />

                    <input
                        type="email"
                        value={email}
                        onChange={(event) =>
                            setEmail(
                                event.target.value
                            )
                        }
                        required
                        style={{
                            width: "100%",
                            padding: "10px",
                            marginTop: "5px"
                        }}
                    />
                </div>

                {/* Button */}
                <button
                    type="submit"
                    style={{
                        padding: "10px 20px",
                        marginRight: "10px",
                        cursor: "pointer"
                    }}
                >
                    {editingId
                        ? "Cập nhật"
                        : "Thêm sinh viên"}
                </button>

                {/* Button Hủy */}
                {editingId && (
                    <button
                        type="button"
                        onClick={handleCancel}
                        style={{
                            padding: "10px 20px",
                            cursor: "pointer"
                        }}
                    >
                        Hủy
                    </button>
                )}
            </form>

            {/* Thông báo thành công */}
            {message && (
                <p style={{ color: "green" }}>
                    {message}
                </p>
            )}

            {/* Thông báo lỗi */}
            {error && (
                <p style={{ color: "red" }}>
                    Lỗi: {error}
                </p>
            )}

            <hr
                style={{
                    margin: "30px 0"
                }}
            />

            {/* ================================
                DANH SÁCH SINH VIÊN
            ================================= */}
            <h2>Danh sách sinh viên</h2>

            {loading && (
                <p>Đang tải dữ liệu...</p>
            )}

            {!loading &&
                students.length === 0 && (
                    <p>
                        Chưa có sinh viên nào.
                    </p>
                )}

            {!loading &&
                students.length > 0 && (
                    <table
                        border="1"
                        cellPadding="10"
                        style={{
                            width: "100%",
                            borderCollapse:
                                "collapse"
                        }}
                    >
                        <thead>
                            <tr>
                                <th>MSSV</th>
                                <th>Họ tên</th>
                                <th>Email</th>
                                <th>Thao tác</th>
                            </tr>
                        </thead>

                        <tbody>
                            {students.map(
                                (student) => (
                                    <tr
                                        key={
                                            student._id
                                        }
                                    >
                                        <td>
                                            {
                                                student.studentId
                                            }
                                        </td>

                                        <td>
                                            {
                                                student.name
                                            }
                                        </td>

                                        <td>
                                            {
                                                student.email
                                            }
                                        </td>

                                        <td>
                                            {/* Sửa */}
                                            <button
                                                onClick={() =>
                                                    handleEdit(
                                                        student
                                                    )
                                                }
                                                style={{
                                                    marginRight:
                                                        "10px",
                                                    cursor:
                                                        "pointer"
                                                }}
                                            >
                                                Sửa
                                            </button>

                                            {/* Xóa */}
                                            <button
                                                onClick={() =>
                                                    handleDelete(
                                                        student._id
                                                    )
                                                }
                                                style={{
                                                    cursor:
                                                        "pointer"
                                                }}
                                            >
                                                Xóa
                                            </button>
                                        </td>
                                    </tr>
                                )
                            )}
                        </tbody>
                    </table>
                )}
        </div>
    );
}

export default App;