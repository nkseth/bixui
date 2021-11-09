import React from "react";
import Swal from "sweetalert2";
import Button from "../../../components/Button";
import DashboardWrapper from "../../../components/dashboard/DashboardWrapper";
import FormWrapper from "../../../components/dashboard/FormWrapper";
import api from "../../../constants/api";
import { User } from "../../../constants/types";
import { useStoreState } from "../../../hooks/store";
import Image from 'next/image';
import styles from "../../../styles/dashboard/booth/all/page.module.scss";
import logoFooter from '../../../public/logo_footer.png';

type AdminPorps = {};

const Admin: React.FC<AdminPorps> = ({}) => {
   const [filterKeyword, setFilterKeyword] = React.useState("");

   const [users, setUsers] = React.useState<User[]>([]);

   const filteredResult = users.filter((users) =>
      users.email.includes(filterKeyword)
   );

   const user = useStoreState((s) => s.user);

   React.useEffect(() => {
      if (!user) return;

      handleUsersFetch();
   }, [user]);

   const handleUsersFetch = async () => {
      try {
         const { data } = await api.get("/users/all");

         setUsers(data.data);
      } catch (error) {}
   };

   const handleUserBlock = async (email: string) => {
      try {
         const selectedUser = users.filter((u) => u.email === email)[0];

         const { isConfirmed } = await Swal.fire({
            icon: "question",
            text: `Are you sure you want to ${
               selectedUser.deletedAt ? "un" : ""
            }block this user ?`,
            showConfirmButton: true,
            showDenyButton: true,
         });

         if (!isConfirmed) return;

         const { data } = await api.post("users/delete", { email });

         setUsers((users) =>
            users.map((user) => (user.email === email ? data : user))
         );
      } catch (error) {
         Swal.fire({
            icon: "error",
            text: "Error while changing blocking/unblocking user",
            showConfirmButton: true,
         });
      }
   };

   return (
   <>
      <DashboardWrapper
         headerProps={{
            location: [
               { title: "Dashboard" },
               { title: "Admin" },
               { title: "Users" },
            ],
         }}
      >
         <FormWrapper
            title={
               <input
                  type="text"
                  placeholder="Search by email..."
                  style={{ maxWidth: 265 }}
                  onChange={(e) => setFilterKeyword(e.target.value)}
                  value={filterKeyword}
               />
            }
            divider
         >
            <div className={styles.tableContainer} style={{ marginTop: -10 }}>
               <table style={{ width: "100%" }}>
                  <tr
                     style={{
                        borderBottom: "1px solid #8c8c8c",
                        lineHeight: "36px",
                     }}
                  >
                     <th>Email</th>
                     <th>is Owner ?</th>
                     <th>Joined at</th>
                     <th>Booths</th>
                     <th>Status</th>
                     <th />
                  </tr>
                  <tr style={{ height: 12 }} />
                  {filteredResult.map((u, index) => (
                     <tr key={u.email}>
                        <td>{u.email}</td>
                        <td>{u.isOwner ? "Yes" : "No"}</td>
                        <td>{new Date(u.createdAt).toLocaleString()}</td>
                        <td>{u.booths?.length ?? 0}</td>
                        <td>{u.deletedAt ? "Blocked" : "Active"}</td>
                        <td className={styles.fitContent}>
                           <Button
                              title={u.deletedAt ? "Unblock" : "Block"}
                              disabled={u.email === user?.email}
                              onClick={() => handleUserBlock(u.email)}
                           />
                        </td>
                        {/* <td className={styles.fitContent}>
                           <div className={styles.actionsContainer}>
                              <button
                                 title="Edit"
                                 onClick={() =>
                                    router.push(
                                       `/dashboard/booth/${booth.slug}/edit`
                                    )
                                 }
                              >
                                 <i className="fas fa-pencil" />
                              </button>
                              <button
                                 title="Clone"
                                 onClick={() => handleBoothClone(booth.slug)}
                              >
                                 <i className="fas fa-copy" />
                              </button>
                              <button
                                 title="Delete"
                                 onClick={() => handleBoothDelete(booth.slug)}
                              >
                                 <i className="fas fa-trash-alt" />
                              </button>
                           </div>
                        </td> */}
                     </tr>
                  ))}
               </table>
            </div>
         </FormWrapper>
      </DashboardWrapper>
      <div className={styles.footer}><div className={styles.logo_footer}><Image src={logoFooter} alt="Powered by BizConnect"/></div></div>
   </>
   );
};

export default Admin;
