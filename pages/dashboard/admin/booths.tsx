import React from "react";
import Swal from "sweetalert2";
import Image from 'next/image';
import Button from "../../../components/Button";
import DashboardWrapper from "../../../components/dashboard/DashboardWrapper";
import FormWrapper from "../../../components/dashboard/FormWrapper";
import api from "../../../constants/api";
import { Booth, User } from "../../../constants/types";
import { useStoreState } from "../../../hooks/store";
import logoFooter from '../../../public/logo_footer.png';
import styles from "../../../styles/dashboard/booth/all/page.module.scss";

type AdminPorps = {};

const Booths: React.FC<AdminPorps> = ({}) => {
   const [filterKeyword, setFilterKeyword] = React.useState("");

   const [booths, setBooths] = React.useState<Booth[]>([]);

   const filteredResult = booths.filter((booth) =>
      booth.config.title.includes(filterKeyword)
   );

   const user = useStoreState((s) => s.user);

   React.useEffect(() => {
      if (!user) return;

      handleBoothsFetch();
   }, [user]);

   const handleBoothsFetch = async () => {
      try {
         const { data } = await api.get("/booths/all");

         setBooths(data.data);
      } catch (error) {}
   };

   const handleBoothDelete = async (slug: string) => {
      try {
         const { isConfirmed } = await Swal.fire({
            icon: "question",
            text: `Are you sure you want to delete this booth ?`,
            showConfirmButton: true,
            showDenyButton: true,
         });

         if (!isConfirmed) return;

         const { data } = await api.post(`/booth/${slug}/delete`);

         setBooths((booths) => booths.filter((booth) => booth.slug !== slug));
      } catch (error) {
         Swal.fire({
            icon: "error",
            text: "Error while deleting Booth",
            showConfirmButton: true,
         });
      }
   };

   const toggleBoothActiveStatus = async (slug: string) => {
      const thisBooth = booths.filter((booth) => booth.slug === slug)[0];
      try {
         const { isConfirmed } = await Swal.fire({
            icon: "question",
            text: `Are you sure you want to ${
               thisBooth.isActive ? "de-" : ""
            }activate this Booth ?`,
            showConfirmButton: true,
            showDenyButton: true,
         });

         if (!isConfirmed) return;

         const { data } = await api.post(`/booth/${slug}/toggleStatus`);

         Swal.fire({
            icon: "success",
            text: `Booth ${thisBooth.isActive ? "de-" : ""}activated`,
            showConfirmButton: true,
         });

         setBooths(data.data);
      } catch {
         Swal.fire({
            icon: "error",
            text: "Error while changing Booth status",
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
               { title: "Booths" },
            ],
         }}
      >
         <FormWrapper
            title={
               <input
                  type="text"
                  placeholder="Search by title..."
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
                     <th>Title</th>
                     <th>Slug</th>
                     <th>Owner</th>
                     <th>Created at</th>
                     <th>Images</th>
                     <th>Status</th>
                     <th />
                  </tr>
                  <tr style={{ height: 12 }} />
                  {filteredResult.map((b, index) => (
                     <tr key={b.slug}>
                        <td>{b.config.title}</td>
                        <td>{b.slug}</td>
                        <td>{b.user?.email}</td>
                        <td>{new Date(b.created_at).toLocaleString()}</td>
                        <td>{b.imagesCount}</td>
                        <td>{b.isActive ? "Active" : "Blocked"}</td>
                        <td className={styles.fitContent}>
                           <Button
                              title={b.isActive ? "Block" : "Unblock"}
                              onClick={() => toggleBoothActiveStatus(b.slug)}
                           />
                        </td>
                        <td className={styles.fitContent}>
                           <Button
                              title="Delete"
                              onClick={() => handleBoothDelete(b.slug)}
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

export default Booths;
