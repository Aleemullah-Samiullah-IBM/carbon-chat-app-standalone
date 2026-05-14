import { jsx as o, jsxs as _, Fragment as Ht } from "react/jsx-runtime";
import qg, { useState as R, useEffect as Ee, createContext as fa, useContext as ma, useMemo as wr, useRef as tt, forwardRef as Wg, useReducer as Gg, useLayoutEffect as Xg, useCallback as Nt } from "react";
import { Modal as ga, InlineNotification as Zt, Form as Ws, PasswordInput as Vg, TextInput as _t, AccordionItem as jl, Accordion as Kg, Button as Re, unstable__ChatButton as fn, IconButton as pa, DataTable as Jg, TableContainer as Zg, Table as Yg, TableHead as Qg, TableRow as ev, TableExpandHeader as tv, TableSelectAll as rv, TableHeader as nv, TableBody as av, TableExpandRow as sv, TableSelectRow as Pl, TableCell as ov, TableExpandedRow as iv, Pagination as lv, CopyButton as da, OverflowMenu as $l, OverflowMenuItem as Ot, Loading as Os, Theme as cv, FormGroup as Ct, TextArea as Gs, InlineLoading as uv, Tag as Tl, Header as dv, HeaderName as hv, Tooltip as ql, AILabel as pv, AILabelContent as fv, Tile as mv, Toggletip as gv, ToggletipButton as vv, ToggletipContent as yv, Select as bv, SelectItem as wv, unstable__AiSkeletonText as Xs, FormLabel as Av, Dropdown as Wl, ActionableNotification as _v, Stack as Gl, RadioButtonGroup as Xl, RadioButton as Vl, Link as Cv } from "@carbon/react";
import Kl from "react-markdown";
import Jl from "rehype-raw";
import Zl from "remark-gfm";
import pn from "js-yaml";
import { jwtDecode as Vs } from "jwt-decode";
import Ks from "classnames";
import { CircleDash as xv, CheckmarkOutlineWarning as Sv, ErrorFilled as Js, CheckmarkOutline as Iv, ListChecked as kv, TextNewLine as Pv, InProgress as Tv, Checkmark as Yl, Copy as Ql, Download as Ev, ChevronDown as El, OverflowMenuVertical as Nv, CloseLarge as ec, SubtractAlt as Hv, Send as Mv, SendFilled as Dv, Image as Rv, Close as zv, Launch as Nl, NewTab as Lv, Logout as Ov, Menu as Uv, Maximize as Bv, Minimize as Fv, Information as jv, Clean as $v, TrashCan as qv, Add as Wv, Play as Gv, ArrowRight as Xv } from "@carbon/icons-react";
import tc from "axios";
import { useTranslation as vn, initReactI18next as Vv } from "react-i18next";
import { Trans as aw, useTranslation as sw } from "react-i18next";
import yr from "lodash";
import { UIResourceRenderer as Kv } from "@mcp-ui/client";
import { NoDataEmptyState as Jv, ErrorEmptyState as Zv } from "@carbon/ibm-products";
import { ArtTools_01 as Yv, WindowsHosting as Qv, DevAndTest as ey, DesignResearch as ty } from "@carbon/pictograms-react";
import Jt from "i18next";
import { default as iw } from "i18next";
import ry from "i18next-browser-languagedetector";
const p1 = ({
  open: s,
  onClose: l,
  onSubmit: d,
  authFields: p,
  serverName: h
}) => {
  const [f, v] = R({}), [w, S] = R({}), [N, b] = R(!1), C = p.length === 0;
  Ee(() => {
    if (s) {
      const H = {};
      p.forEach((U) => {
        H[U.name] = "";
      }), v(H), S({}), b(!1);
    }
  }, [s, p]);
  const T = (H, U) => {
    v((M) => ({
      ...M,
      [H]: U
    })), w[H] && S((M) => {
      const F = { ...M };
      return delete F[H], F;
    }), b(!1);
  }, x = () => {
    if (C) return !0;
    const H = {};
    let U = !0;
    return p.forEach((M) => {
      const F = f[M.name];
      M.required && (!F || F.trim() === "") && (H[M.name] = `${M.label} is required`, U = !1);
    }), S(H), U;
  }, L = () => {
    C ? (d({}), l()) : x() ? (d(f), l()) : b(!0);
  };
  return /* @__PURE__ */ o(
    ga,
    {
      open: s,
      onRequestClose: () => {
        v({}), S({}), b(!1), l();
      },
      modalHeading: `MCP Server Authentication: ${h}`,
      modalLabel: "Credentials Required",
      primaryButtonText: C ? "Continue" : "Submit",
      onRequestSubmit: L,
      preventCloseOnClickOutside: !0,
      size: "sm",
      children: /* @__PURE__ */ _("div", { className: "mcp-auth-modal", children: [
        N && Object.keys(w).length > 0 && /* @__PURE__ */ o(
          Zt,
          {
            kind: "error",
            title: "Validation Error",
            subtitle: "Please fill in all required fields",
            lowContrast: !0,
            hideCloseButton: !0
          }
        ),
        C ? /* @__PURE__ */ o("p", { children: "This MCP server does not require authentication. Click Continue to proceed." }) : /* @__PURE__ */ _(Ht, { children: [
          /* @__PURE__ */ o("p", { children: "This MCP server requires authentication. Please provide the following credentials." }),
          p.length > 0 && /* @__PURE__ */ o(
            Ws,
            {
              className: "mcp-auth-modal-form",
              "aria-label": "mcp auth form",
              children: /* @__PURE__ */ o("div", { children: p.map((H, U) => {
                const M = H.required ? /* @__PURE__ */ _(Ht, { children: [
                  H.label,
                  " ",
                  /* @__PURE__ */ o(
                    "span",
                    {
                      className: "required-asterisk",
                      "aria-hidden": "true",
                      children: "*"
                    }
                  )
                ] }) : H.label;
                return /* @__PURE__ */ o("div", { children: H.input === "password" ? /* @__PURE__ */ o(
                  Vg,
                  {
                    id: `mcp-field-${U}`,
                    labelText: M,
                    value: f[H.name] || "",
                    onChange: (F) => T(H.name, F.target.value),
                    invalid: !!w[H.name],
                    invalidText: w[H.name],
                    required: H.required,
                    autoComplete: "new-password"
                  }
                ) : /* @__PURE__ */ o(
                  _t,
                  {
                    id: `mcp-field-${U}`,
                    labelText: M,
                    value: f[H.name] || "",
                    onChange: (F) => T(H.name, F.target.value),
                    invalid: !!w[H.name],
                    invalidText: w[H.name],
                    required: H.required
                  }
                ) }, U);
              }) })
            }
          )
        ] }),
        !C && /* @__PURE__ */ o(
          Zt,
          {
            kind: "info",
            title: "Security Note",
            subtitle: "Credentials are stored locally in your browser and are only sent to the MCP server when needed.",
            lowContrast: !0,
            hideCloseButton: !0
          }
        )
      ] })
    }
  );
}, mn = ({ blockInfo: s }) => {
  let l = /* @__PURE__ */ o(Ht, {});
  return s && (l = /* @__PURE__ */ o(
    Kl,
    {
      remarkPlugins: [Zl],
      rehypePlugins: [Jl],
      className: "markdown",
      components: {
        // Fixed uncontrolled input warning generated by planToMarkdown.tsx
        // for textual plan preview
        // Override checkbox rendering to make them controlled components
        input: ({ node: d, checked: p, ref: h, ...f }) => f.type === "checkbox" ? /* @__PURE__ */ o(
          "input",
          {
            type: "checkbox",
            checked: p || !1,
            onChange: () => {
            },
            disabled: !0
          }
        ) : /* @__PURE__ */ o("input", { ...f })
      },
      children: s
    }
  )), /* @__PURE__ */ o("div", { className: "block-container", children: l });
}, gn = (s) => {
  const l = s ? new Date(s) : /* @__PURE__ */ new Date(), d = l.getHours(), p = l.getMinutes().toString().padStart(2, "0"), h = d >= 12 ? "PM" : "AM";
  return `${d % 12 || 12}:${p} ${h}`;
};
function f1(s) {
  const l = /* @__PURE__ */ new Date();
  return new Date(
    l.getTime() + s * 1e3
  ).toISOString();
}
function m1(s) {
  return s.filter(
    (l) => l.event.type === "user-message" || l.event.type === "agent-plan" || l.event.type === "user-command" || l.event.type === "agent-message"
  ).map((l) => ({
    ...l,
    event: {
      ...l.event
    },
    timestamp: gn(l.timestamp)
    //new Date(item.timestamp).toLocaleString(),
  }));
}
function g1(s) {
  if (typeof s == "object" && s !== null) {
    const l = Object.keys(s);
    for (const d of l)
      if (typeof s[d] == "object" && s[d] !== null)
        return !0;
    return !1;
  }
  return !1;
}
const rc = (s) => {
  let l = s.trim();
  return l.startsWith("@") && (l = l.slice(1)), (l.startsWith("'") && l.endsWith("'") || l.startsWith('"') && l.endsWith('"')) && (l = l.slice(1, -1)), l.includes("/") ? l.split("/").at(-1) : l;
}, v1 = (s) => s?.element || s instanceof Error ? s.message : String(s), Hl = (s) => {
  const l = s.lastIndexOf(".");
  return l === -1 ? null : s.substring(l + 1);
}, ny = (s, l) => l.find((d) => d.filename === s), nc = (s) => {
  function l(h) {
    return typeof h == "object" && h !== null && "filename" in h;
  }
  function d(h) {
    if (!(h === null || h === "")) {
      if (l(h))
        return h.filename;
      if (Array.isArray(h))
        return h.map(d);
      if (typeof h == "object" && h !== null) {
        const f = {};
        for (const v in h)
          h.hasOwnProperty(v) && (f[v] = d(h[v]));
        return f;
      }
      return h;
    }
  }
  return d(
    JSON.parse(JSON.stringify(s))
  );
}, y1 = (s) => {
  try {
    return { data: Vs(s) };
  } catch (l) {
    return { error: l };
  }
}, ay = (s) => {
  const l = /@'[^']*'|@"[^"]*"|'[^']*'|"[^"]*"|[^ ]+/g;
  return s.match(l) ?? [];
}, b1 = (s) => ay(s).map((d) => d.startsWith("@") ? rc(d) : d).join(" "), sy = (s, l, d) => {
  const p = oy(s), h = iy(s), f = l.find((N) => N.name === p);
  if (!f)
    return { missingFields: [], parsedCommandArgs: {} };
  const v = f.parameters.map((N) => N.name);
  ly(h, v);
  const w = hy(
    h,
    v,
    d
  );
  return { missingFields: py(
    l,
    p,
    w
  ), parsedCommandArgs: w };
};
function oy(s) {
  return s.split(" ")[0].slice(1);
}
function iy(s) {
  return s.substring(s.indexOf(" ") + 1).trim();
}
function ly(s, l) {
  const d = s.split(/\s+/);
  for (const p of d)
    if (l.includes(p) && !p.includes(":"))
      throw new Error(
        `Invalid format for part: '${p}'. Expected 'key:value' or 'key: value'.`
      );
}
function cy(s, l) {
  let d = null;
  for (const p of l) {
    const f = new RegExp(`\\b${p}:`, "i").exec(s);
    f && (d === null || f.index < d.index) && (d = { name: p, index: f.index });
  }
  return d;
}
function uy(s, l, d, p) {
  let h = s.length;
  for (const f of p) {
    if (f === d) continue;
    const w = new RegExp(`\\b${f}:`, "i").exec(s.substring(l));
    w && l + w.index < h && (h = l + w.index);
  }
  return h;
}
function dy(s, l) {
  if (s.startsWith("@")) {
    const d = rc(s) ?? s;
    return ny(d, l) || s;
  }
  return s;
}
function hy(s, l, d) {
  const p = {};
  let h = s;
  for (; h.length > 0; ) {
    const f = cy(h, l);
    if (!f) break;
    const v = f.name, w = f.index + v.length + 1, S = uy(
      h,
      w,
      v,
      l
    ), N = h.substring(w, S).trim();
    p[v] = dy(N, d), h = h.substring(S).trim();
  }
  return p;
}
function py(s, l, d) {
  const p = s.find((f) => f.name === l);
  if (!p || !Array.isArray(p.parameters)) return [];
  const h = [];
  for (const f of p.parameters)
    f.required && (!d.hasOwnProperty(f.name) || d[f.name] === "" || d[f.name] === null) && h.push(f.name);
  return h;
}
const w1 = (s) => ["agent-plan", "agent-message", "selection-request"].includes(s), A1 = (s, l) => s === "agent-plan" && l.planned_toolcalls?.length === 0 || s === "agent-message" || s === "selection-request", _1 = (s, l) => s === "agent-plan" && l.executed_toolcalls && l.planned_toolcalls?.length > 0;
function C1(s, l, d) {
  let p = {};
  if (s && typeof s == "string")
    try {
      p = JSON.parse(s);
    } catch {
      console.error("Existing context is not valid JSON. Start new.");
    }
  return p[l] = d, JSON.stringify(p);
}
function x1(s, l, d, p, h, f) {
  if (s.length > 0) {
    d((w) => [
      ...w,
      ...s.map((S) => ({ ...S, headers: l }))
    ]);
    const v = s[s.length - 1].event;
    v.type === "agent-plan" && (v?.planned_toolcalls ?? []).length > 0 ? (p({
      executed_toolcalls: [...v.executed_toolcalls ?? []],
      planned_toolcalls: [...v.planned_toolcalls ?? []]
    }), h(!0)) : f();
  }
}
const S1 = (s, l) => {
  if (!(!s || s.length === 0))
    return s?.find(
      (d) => d.arguments?.operation?.operation_id === l
    );
}, I1 = (s, l) => {
  if (!(!s || s.length === 0))
    switch (l) {
      case "governance_validation":
        return s.find(
          (d) => d.extra_data?.validation_errors?.value
        );
      case "governance_remediation":
        return s.find(
          (d) => d.extra_data?.remediation?.value
        );
      case "suggestions":
        return s.find(
          (d) => d.extra_data?.enhanced_openapi?.value?.body?.suggestions
        );
      case "autocorrect":
        return s.find(
          (d) => d?.extra_data?.enhanced_openapi?.value?.fixedOpenAPI
        );
    }
}, k1 = (s) => {
  const l = new Date(s), d = /* @__PURE__ */ new Date(), p = d.getTime() - l.getTime(), h = Math.floor(p / 1e3), f = Math.floor(h / 60), v = Math.floor(f / 60), w = Math.floor(v / 24);
  return h < 30 ? "Just now" : f < 1 ? "Less than a minute ago" : f < 60 ? `${f} minute${f !== 1 ? "s" : ""} ago` : v < 24 ? `${v} hour${v !== 1 ? "s" : ""} ago` : w === 1 ? "Yesterday" : w < 7 ? `${w} day${w !== 1 ? "s" : ""} ago` : l.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: l.getFullYear() !== d.getFullYear() ? "numeric" : void 0
  });
}, P1 = async (s) => {
  const {
    input: l,
    attachments: d,
    commands: p,
    chatUUID: h,
    apiService: f,
    setError: v,
    clearError: w,
    setMessages: S,
    setIsToolcallMode: N,
    setPlan: b,
    setLoading: C,
    chatUUIDRef: T,
    onOpenAttachments: x
  } = s;
  try {
    const L = l.trim().split(" ")[0].slice(1), { missingFields: G, parsedCommandArgs: H } = sy(
      l.trim(),
      p,
      d
    );
    if (G.length > 0) {
      const F = `Missing required fields for command: ${G.join(
        ", "
      )}`;
      v(F);
      return;
    } else
      w();
    const U = await f?.postUserCommand(
      h,
      L,
      H
    ), M = U?.data;
    if (M.error) {
      if (console.log("userCommandResponse", M), T.current !== h) {
        console.warn("Discard response for old chatUUID", h);
        return;
      }
      S((F) => [
        ...F,
        {
          event: {
            type: "agent-message",
            agent_message: `${M.error?.response?.data?.message?.[0]}`,
            response_details: [
              {
                output: `${M.error?.name}: ${M.error?.message}`
              }
            ],
            attachments: {}
          },
          timestamp: gn(),
          headers: U?.headers
        }
      ]);
    }
    if (M.type === "agent-plan" || M.type === "agent-message") {
      if (T.current !== h) {
        console.warn("Discard response for old chatUUID", h);
        return;
      }
      S((J) => [
        ...J,
        {
          event: { ...M },
          timestamp: gn(),
          headers: U?.headers
        }
      ]), M.planned_toolcalls?.length > 0 && (N(!0), b({
        executed_toolcalls: [...M.executed_toolcalls],
        planned_toolcalls: [...M.planned_toolcalls]
      }));
      const F = M?.response_details?.flatMap((J) => J.artifacts || []).filter(
        (J) => !J.filename?.toLowerCase().endsWith(".zip")
      ) ?? [];
      F.length > 0 && x && x(F);
    }
  } catch (L) {
    v(L);
  } finally {
    C(!1);
  }
}, Ml = ({
  toolcall: s,
  stepNumber: l,
  disabled: d = !1,
  hideStatus: p = !1
}) => {
  const h = Ks({
    "toolcall-error-message": s.status === "failure",
    "toolcall-warning-message": s.status === "warning",
    "toolcall-success-message": s.status === "success",
    "toolcall-message": !["failure", "warning", "success"].includes(
      s.status
    )
  }), f = () => {
    switch (s.status) {
      case "success":
        return /* @__PURE__ */ o(Iv, { className: "status-svg svg-checkmark" });
      case "failure":
        return /* @__PURE__ */ o(Js, { className: "status-svg svg-error" });
      case "warning":
        return /* @__PURE__ */ o(Sv, { className: "status-svg svg-warning" });
      default:
        return /* @__PURE__ */ o(xv, { className: "status-svg svg-not-started" });
    }
  }, v = () => {
    const N = s.status ? s.summarized_output ?? s.status : "Not Started";
    return s.summarized_output ? /* @__PURE__ */ o("span", { className: h, children: /* @__PURE__ */ o(mn, { blockInfo: N }) }) : /* @__PURE__ */ o("span", { className: h, children: N });
  }, w = (N) => {
    try {
      const b = N.arguments?.operation?.operation_id;
      if (b) {
        const x = b.split("_").join(" "), L = x.charAt(0).toUpperCase() + x.slice(1);
        return `${N.name}: ${L}`;
      }
      const [C, T] = N.name.split("<op_separator>");
      if (T) {
        const x = T.split("_").join(" "), L = x.charAt(0).toUpperCase() + x.slice(1);
        return `${C}: ${L}`;
      }
      return N.name;
    } catch {
      return console.log("formatStepName: encountered unexpected error"), N.name;
    }
  }, S = /* @__PURE__ */ _("div", { className: "toolcall-header", children: [
    /* @__PURE__ */ _("div", { className: "toolcall-header-left", children: [
      "Step ",
      l
    ] }),
    /* @__PURE__ */ _("div", { className: "toolcall-header-right", children: [
      /* @__PURE__ */ o("span", { className: "toolcall-title", children: s.title || w(s) }),
      !p && /* @__PURE__ */ _("span", { className: "toolcall-status-container", children: [
        /* @__PURE__ */ o("span", { className: "status-svg-wrapper", children: f() }),
        v()
      ] })
    ] })
  ] });
  return /* @__PURE__ */ o(
    jl,
    {
      className: "toolcall",
      disabled: d,
      title: S,
      children: /* @__PURE__ */ o("pre", { className: "toolcall-arguments", children: pn.dump(nc(s.arguments)) })
    }
  );
}, Zs = ({
  executed_toolcalls: s,
  planned_toolcalls: l,
  hideStatus: d = !1,
  disabled: p = !1
}) => /* @__PURE__ */ _(
  Kg,
  {
    align: "start",
    size: "sm",
    disabled: p,
    children: [
      s?.map((h, f) => /* @__PURE__ */ o(
        Ml,
        {
          toolcall: h,
          stepNumber: f + 1,
          hideStatus: d
        },
        `executed-${h.name}-${f}`
      )),
      l?.map((h, f) => /* @__PURE__ */ o(
        Ml,
        {
          toolcall: h,
          stepNumber: (s?.length || 0) + f + 1,
          hideStatus: d
        },
        `planned-${h.name}-${f}`
      ))
    ]
  }
), ac = fa({
  setPromptValue: () => {
  },
  registerInputHandler: () => {
  },
  inputRef: { current: null }
}), fy = ({ children: s }) => {
  const [l, d] = R(
    () => () => {
    }
  ), p = tt(null), h = wr(
    () => ({
      setPromptValue: (f) => {
        l(f);
      },
      registerInputHandler: (f) => {
        d(() => f);
      },
      inputRef: p
    }),
    [l]
  );
  return /* @__PURE__ */ o(ac.Provider, { value: h, children: s });
}, va = () => {
  const s = ma(ac);
  if (!s)
    throw new Error("useInput must be used within an InputProvider");
  return s;
}, sc = fa(void 0), T1 = ({ children: s }) => {
  const [l, d] = R(null), [p, h] = R(!1), [f, v] = R(!1), [w, S] = R(!1), [N, b] = R(!1), [C, T] = R(""), [x, L] = R(""), [G, H] = R(ne()), [U, M] = R(!0), [F, J] = R(""), [j, se] = R({
    API_URL: "",
    OVERRIDE_TOKEN: "",
    "X-ibm-user": "",
    "X-ibm-org": "",
    nonce: ""
  }), [te, de] = R("");
  function ne() {
    if (x === "indefinite")
      return !0;
    let he = !1;
    const Ae = new Date(x), ye = /* @__PURE__ */ new Date();
    return Ae != null && Ae > ye && (he = !0), he;
  }
  const [B, z] = R([]), $ = wr(
    () => ({
      plan: l,
      setPlan: d,
      startNewChat: p,
      setStartNewChat: h,
      isApprovalSubmitting: f,
      setIsApprovalSubmitting: v,
      apicToken: C,
      setApicToken: T,
      apicTokenExpirationDate: x,
      setApicTokenExpirationDate: L,
      isLoggedIn: G,
      setIsLoggedIn: H,
      hostUrl: F,
      setHostUrl: J,
      auth: j,
      setAuth: se,
      nonce: te,
      setNonce: de,
      showPorgSelection: w,
      setShowPorgSelection: S,
      showProjectSelection: N,
      setShowProjectSelection: b,
      checkLogin: ne,
      selectedFiles: B,
      setSelectedFiles: z,
      isDarkTheme: U,
      setIsDarkTheme: M
    }),
    [
      l,
      p,
      f,
      C,
      x,
      G,
      F,
      j,
      te,
      w,
      N,
      B,
      U
    ]
  );
  return /* @__PURE__ */ o(sc.Provider, { value: $, children: /* @__PURE__ */ o(fy, { children: s }) });
}, dt = () => {
  const s = ma(sc);
  if (!s)
    throw new Error("useMyContext must be used within a ChatProvider");
  return s;
}, my = ({
  title: s = "Plan",
  nonEditable: l = !1,
  plan: d,
  instance: p,
  onSpecialSave: h,
  onSave: f,
  setIsEditPage: v = () => {
  },
  isApprovalSubmitting: w
}) => {
  const S = dt(), N = d !== void 0 ? d : S.plan, b = w !== void 0 ? w : S.isApprovalSubmitting, C = () => {
    h ? h("plan", N, p) : f && f();
  };
  return !N || !(N.executed_toolcalls?.length || N.planned_toolcalls?.length) ? null : /* @__PURE__ */ _("div", { className: "plan-container", children: [
    /* @__PURE__ */ o("div", { className: "plan-header", children: /* @__PURE__ */ o("span", { className: "plan-title", children: s }) }),
    /* @__PURE__ */ o(
      Zs,
      {
        executed_toolcalls: N.executed_toolcalls || [],
        planned_toolcalls: N.planned_toolcalls || [],
        disabled: b || l,
        hideStatus: (N?.executed_toolcalls?.length ?? 0) === 0
      }
    ),
    (N?.planned_toolcalls?.length ?? 0) > 0 && /* @__PURE__ */ _("div", { className: "plan-actions", children: [
      /* @__PURE__ */ o(
        Re,
        {
          kind: "secondary",
          disabled: b || l,
          onClick: () => v(!0),
          children: /* @__PURE__ */ o("span", { className: "plan-action-button-content", children: "Edit" })
        }
      ),
      /* @__PURE__ */ o(
        Re,
        {
          kind: "primary",
          disabled: b || l,
          onClick: C,
          children: /* @__PURE__ */ o("span", { className: "plan-action-button-content", children: N?.executed_toolcalls?.length === 0 ? "Start" : "Continue" })
        }
      )
    ] })
  ] });
}, gy = ({
  executed_toolcalls: s,
  planned_toolcalls: l
}) => {
  const d = (h) => {
    try {
      const f = h.arguments?.operation?.operation_id;
      if (f) {
        const S = f.split("_").join(" ");
        return S.charAt(0).toUpperCase() + S.slice(1);
      }
      const [v, w] = h.name.split("<op_separator>");
      if (w) {
        const S = w.split("_").join(" ");
        return S.charAt(0).toUpperCase() + S.slice(1);
      }
      return h.name;
    } catch {
      return h.name;
    }
  }, p = [
    ...s.map((h) => ({
      ...h,
      completed: !0
    })),
    ...l.map((h) => ({
      ...h,
      completed: !1
    }))
  ];
  return /* @__PURE__ */ o("div", { className: "progress-timeline", children: p.map((h, f) => {
    const v = h.title || d(h), w = nc(h.arguments), S = pn.dump(w, {
      indent: 2,
      noRefs: !0,
      sortKeys: !1
    }), N = f === p.length - 1;
    return /* @__PURE__ */ _(
      "div",
      {
        className: "progress-step",
        children: [
          /* @__PURE__ */ _("div", { className: "step-indicator", children: [
            /* @__PURE__ */ o(
              "div",
              {
                className: `step-circle ${h.completed ? "completed" : "pending"}`
              }
            ),
            !N && /* @__PURE__ */ o("div", { className: "step-line" })
          ] }),
          /* @__PURE__ */ _("div", { className: "step-content", children: [
            /* @__PURE__ */ o("div", { className: "step-header", children: /* @__PURE__ */ o("span", { className: "step-name", children: v }) }),
            S.trim() && /* @__PURE__ */ o("div", { className: "step-args", children: /* @__PURE__ */ o("pre", { children: /* @__PURE__ */ o("code", { children: S }) }) })
          ] })
        ]
      },
      f
    );
  }) });
}, vy = ({
  title: s = "Plan",
  event: l
}) => {
  const d = dt(), p = l !== void 0 ? l : d.plan;
  return !p || !(p.executed_toolcalls?.length || p.planned_toolcalls?.length) ? null : /* @__PURE__ */ _("div", { className: "textual-plan-container", children: [
    /* @__PURE__ */ o("div", { className: "textual-plan-header", children: /* @__PURE__ */ _("h4", { className: "textual-plan-title", children: [
      /* @__PURE__ */ o(kv, { size: 24 }),
      " Plan: ",
      s
    ] }) }),
    /* @__PURE__ */ o("div", { className: "textual-plan-content", children: /* @__PURE__ */ o(
      gy,
      {
        executed_toolcalls: p.executed_toolcalls ?? [],
        planned_toolcalls: p.planned_toolcalls ?? []
      }
    ) })
  ] });
}, yy = ({
  title: s,
  executed_toolcalls: l,
  planned_toolcalls: d
}) => /* @__PURE__ */ _("div", { className: "plan-container", children: [
  /* @__PURE__ */ o("div", { className: "plan-header", children: /* @__PURE__ */ o("span", { className: "plan-title", children: s }) }),
  /* @__PURE__ */ o(
    Zs,
    {
      executed_toolcalls: l,
      planned_toolcalls: d,
      hideStatus: (l?.length ?? 0) === 0
    }
  )
] }), by = (s) => s.map((d) => d.debug).join("");
function wy(s, l) {
  return `${s} ${Object.entries(l).map(
    ([d, p]) => (
      // check the value is an object with 'filename' property
      // otherwise, for most key-value string pairs
      xy(p) ? `${d}:${p.filename}` : `${d}:${p}`
    )
  ).join(" ")}`;
}
function Ay(s) {
  const l = s.type === "agent-plan", d = s.type === "agent-message", p = s.type === "selection-request", h = s.type === "user-message", f = s.type === "user-command";
  return {
    isAgent: l,
    isOnlyAgentMessage: d,
    isSelectionMessage: p,
    isUser: h || f,
    isUserMessage: h,
    isUserCommand: f,
    isPlanEvent: !!(l && Array.isArray(s.executed_toolcalls) && Array.isArray(s.planned_toolcalls)),
    isFirstMessage: l && !!s.first_message
  };
}
function _y(s) {
  return s === "reqID" ? "Request ID" : s === "chatUUID" ? "Chat session ID" : s === "debug" ? "Debug" : "Unknown";
}
const oc = (s) => Array.isArray(s?.planned_toolcalls) && s?.planned_toolcalls.length > 0, Cy = (s) => Array.isArray(s?.executed_toolcalls) && s?.executed_toolcalls.length > 0 && Array.isArray(s?.planned_toolcalls) && s?.planned_toolcalls.length === 0;
function xy(s) {
  return typeof s == "object" && s !== null && "filename" in s;
}
function Sy(s) {
  return !!s?.response_details?.length && !!s?.response_details[0]?.extra_data?.html_resource;
}
function Iy(s) {
  return s?.response_details?.length ? s.response_details.find(
    (d) => d && typeof d == "object" && "remote_dom_url" in d
  )?.remote_dom_url ?? null : null;
}
const ky = ({
  event: s,
  isPlanEvent: l,
  isSelectionMessage: d,
  isLatestMessage: p
}) => d || l && oc(s) && !p ? /* @__PURE__ */ o(
  yy,
  {
    title: s.plan_title ?? "Proposed Plan",
    executed_toolcalls: s.executed_toolcalls ?? [],
    planned_toolcalls: s.planned_toolcalls ?? []
  }
) : null, Dl = (s) => /* @__PURE__ */ o("ul", { className: "headless-accordion-item-container", children: /* @__PURE__ */ o(
  jl,
  {
    ...s,
    className: `headless-accordion-item ${s.className}`,
    children: s.children
  }
) }), Py = ({
  nextActionList: s,
  nonEditable: l = !1
}) => {
  const { inputRef: d, setPromptValue: p } = va();
  Ee(() => {
    d.current?.focus();
  }, []);
  const h = (v) => {
    p(v), d.current?.focus();
  };
  let f = s.map((v) => /* @__PURE__ */ _(
    fn,
    {
      onClick: () => h(v),
      kind: "tertiary",
      size: "sm",
      disabled: l,
      children: [
        /* @__PURE__ */ o(Pv, {}),
        " " + v
      ]
    },
    v
  ));
  return /* @__PURE__ */ o("div", { className: "next-action-container", children: f });
}, Ty = ({ firstActionList: s }) => {
  const { isDarkTheme: l } = dt();
  return /* @__PURE__ */ o("div", { className: "first-actions-container", children: s?.map((d) => {
    const p = d.icon;
    return /* @__PURE__ */ _(
      "div",
      {
        className: "first-actions-pair",
        children: [
          /* @__PURE__ */ o(p, { fill: l ? "#ffffff" : "#000000" }),
          /* @__PURE__ */ _("div", { children: [
            d.message,
            " "
          ] })
        ]
      },
      d.message
    );
  }) });
}, Us = Wg((s, l) => {
  const { debounce: d, ...p } = s, [h, f] = R(s.children), [v, w] = R(!1), S = tt(null), N = async (b) => {
    if (!(v || !s.onClick))
      if (S.current && S.current.blur(), d) {
        f(/* @__PURE__ */ o(Tv, {})), w(!0);
        try {
          s.onClick(b), f(/* @__PURE__ */ o(Yl, {}));
        } catch {
          f(/* @__PURE__ */ o(Js, {}));
        } finally {
          setTimeout(() => {
            f(s.children), w(!1);
          }, 2e3);
        }
      } else
        s.onClick(b);
  };
  return Ee(() => {
    f(s.children);
  }, [s.children]), /* @__PURE__ */ o("span", { className: "dynamic-icon-btn", children: /* @__PURE__ */ o(
    pa,
    {
      ...p,
      onClick: N,
      ref: l || S,
      enterDelayMs: v ? 2e3 : p.enterDelayMs,
      children: h
    }
  ) });
}), Ey = ({
  selectionType: s,
  title: l = "",
  origHeaders: d = [],
  origRows: p = [],
  preSelectedRows: h = [],
  nonEditable: f = !0,
  onSave: v
}) => {
  const { isApprovalSubmitting: w } = dt(), [S, N] = R(0), [b, C] = R(5), [T] = R([5, 10, 15, 20, 25]), [x, L] = R(
    Math.floor(S / b) + 1 || 1
  ), [G, H] = R(h), [U, M] = R(/* @__PURE__ */ new Set()), [F, J] = R(!1), j = d.length > 0 ? [
    {
      key: d[0].data_key,
      header: d[0].title
    }
  ] : [], se = d.map((ae) => ae.data_key).slice(1), te = p.map((ae, le) => ({
    id: String(le),
    ...ae
  })), de = (ae) => {
    H([ae]);
  }, ne = (ae, le) => {
    H(
      (xe) => le ? [...xe, ae] : xe.filter((qe) => qe !== ae)
    );
  }, B = (ae) => {
    H(ae ? te.map((le) => le.id) : []);
  }, z = () => {
    const ae = te.filter(
      (le) => G.includes(le.id)
    ).length;
    return ae === 0 ? !1 : ae === te.length ? !0 : "indeterminate";
  }, $ = () => {
    if (F)
      M(/* @__PURE__ */ new Set()), J(!1);
    else {
      const ae = new Set(te.map((le) => le.id));
      M(ae), J(!0);
    }
  }, he = (ae) => {
    M((le) => {
      const xe = new Set(le);
      return xe.has(ae) ? xe.delete(ae) : xe.add(ae), xe;
    });
  }, Ae = () => {
    const ae = G.map(
      (le) => te.findIndex((xe) => xe.id === le)
    );
    ae.length === 1 ? v(ae[0]) : v(ae);
  }, ye = () => {
    v(-1);
  }, Ne = (ae) => {
    const le = d.find((xe) => xe.data_key === ae);
    return le ? le.title : ae;
  }, Ce = (ae) => d.find((le) => le.data_key === ae)?.format, Le = (ae, le) => {
    const xe = typeof le == "string" ? le : JSON.stringify(le, null, 2);
    switch (Ce(ae)) {
      case "secret":
        return /* @__PURE__ */ o(Ny, { value: xe });
      case "markdown":
        return /* @__PURE__ */ o(mn, { blockInfo: xe });
      case "plain":
        return xe;
      default:
        return xe;
    }
  };
  return /* @__PURE__ */ _("div", { className: "table-selection", children: [
    /* @__PURE__ */ o(
      Jg,
      {
        rows: te,
        headers: j,
        ...s === "selection" ? { radio: !0 } : {},
        children: ({
          rows: ae,
          headers: le,
          getExpandHeaderProps: xe,
          getRowProps: qe,
          getSelectionProps: Ve,
          getTableProps: ft,
          getTableContainerProps: Mt
        }) => /* @__PURE__ */ o(Ht, { children: /* @__PURE__ */ o(
          Zg,
          {
            title: "",
            description: "",
            ...Mt(),
            children: /* @__PURE__ */ _(
              Yg,
              {
                ...ft(),
                "aria-label": "selection table",
                children: [
                  /* @__PURE__ */ o(Qg, { children: /* @__PURE__ */ _(ev, { children: [
                    /* @__PURE__ */ o(
                      tv,
                      {
                        enableToggle: !0,
                        ...xe(),
                        isExpanded: ae.every((Te) => Te.isExpanded === !0),
                        onClick: $,
                        "aria-label": "expand row"
                      }
                    ),
                    s === "selection" && /* @__PURE__ */ o("th", { scope: "col" }),
                    s === "multi-selection" && /* @__PURE__ */ o(
                      rv,
                      {
                        ...Ve(),
                        indeterminate: z() === "indeterminate",
                        checked: z() === !0,
                        disabled: w || f,
                        onSelect: () => {
                          B(
                            !ae.some((Te) => G.includes(Te.id))
                          );
                        }
                      }
                    ),
                    /* @__PURE__ */ o(nv, { children: l })
                  ] }) }),
                  /* @__PURE__ */ o(av, { className: "table-body", children: ae.slice(S, S + b).map((Te, xt) => {
                    const { key: Ke, ...rt } = qe({ row: Te });
                    return /* @__PURE__ */ _(qg.Fragment, { children: [
                      /* @__PURE__ */ _(
                        sv,
                        {
                          ...rt,
                          isExpanded: U.has(Te.id),
                          onExpand: () => he(Te.id),
                          children: [
                            s === "selection" && /* @__PURE__ */ o(
                              Pl,
                              {
                                ...Ve({
                                  row: Te,
                                  disabled: w || f,
                                  onChange: () => {
                                    de(Te.id);
                                  }
                                }),
                                checked: G.includes(Te.id)
                              }
                            ),
                            s === "multi-selection" && /* @__PURE__ */ o(
                              Pl,
                              {
                                ...Ve({
                                  row: Te
                                }),
                                disabled: w || f,
                                checked: G.includes(Te.id),
                                onSelect: () => {
                                  ne(
                                    Te.id,
                                    !G.includes(Te.id)
                                  );
                                }
                              }
                            ),
                            Te.cells.map((Je) => /* @__PURE__ */ o(ov, { children: Je.value }, Je.id))
                          ]
                        }
                      ),
                      /* @__PURE__ */ o(
                        iv,
                        {
                          colSpan: le.length + (s === "none" ? 1 : 2),
                          className: "expanded-row",
                          children: p[xt + S] ? /* @__PURE__ */ o("ul", { children: Object.entries(p[xt + S]).filter(
                            ([Je]) => se.includes(Je)
                          ).map(([Je, ie]) => /* @__PURE__ */ _(
                            "li",
                            {
                              className: "detail-item",
                              children: [
                                /* @__PURE__ */ o("strong", { className: "key", children: Ne(Je) }),
                                Le(Je, ie)
                              ]
                            },
                            Je
                          )) }) : /* @__PURE__ */ o("div", { children: "No details available for this item." })
                        }
                      )
                    ] }, Te.id);
                  }) })
                ]
              }
            )
          }
        ) })
      }
    ),
    (p.length || 0) > 5 && /* @__PURE__ */ o(
      lv,
      {
        page: x,
        pageSize: b,
        pageSizes: T,
        totalItems: p.length || 0,
        onChange: ({ page: ae, pageSize: le }) => {
          L(ae), C(le), N((ae - 1) * le);
        }
      }
    ),
    s !== "none" && /* @__PURE__ */ _("div", { className: "action-buttons", children: [
      /* @__PURE__ */ o(
        fn,
        {
          isQuickAction: !0,
          disabled: w || f,
          onClick: ye,
          children: "Select none"
        }
      ),
      /* @__PURE__ */ o(
        fn,
        {
          isQuickAction: !0,
          disabled: G.length === 0 || w || f,
          onClick: Ae,
          children: "Continue"
        }
      )
    ] })
  ] });
}, Ny = (s) => {
  const l = (d) => {
    navigator.clipboard.writeText(d);
  };
  return /* @__PURE__ */ _("div", { className: "secret-wrapper", children: [
    /* @__PURE__ */ o("span", { className: "secret-text", children: /* @__PURE__ */ o(
      "text",
      {
        className: "secret-text-hidden",
        children: Array(Math.min(18, s.value.length)).fill("*")
      }
    ) }),
    /* @__PURE__ */ o("div", { className: "secret-actions", children: /* @__PURE__ */ o(
      Us,
      {
        label: "Copy",
        onClick: () => l(s.value),
        size: "sm",
        align: "bottom",
        enterDelayMs: 250,
        leaveDelayMs: 0,
        debounce: !0,
        children: /* @__PURE__ */ o(Ql, {})
      }
    ) })
  ] });
}, Hy = ({
  details: s = [],
  isLatestMessage: l,
  onSaveSelection: d,
  eventType: p
}) => /* @__PURE__ */ o("div", { className: "response-details", children: s.map(({ step_id: h, table: f, output: v }) => f && p === "selection-request" ? /* @__PURE__ */ o(
  "div",
  {
    className: "response-details-block",
    children: /* @__PURE__ */ o(
      Ey,
      {
        selectionType: "selection",
        title: f.title,
        origHeaders: f.columns,
        origRows: f.rows,
        nonEditable: !l,
        onSave: d
      }
    )
  },
  h
) : null) });
tc.interceptors.response.use(
  (s) => s,
  async (s) => {
    const l = s instanceof Error ? s : new Error("Unknown error occurred");
    return Promise.reject(l);
  }
);
function Rl() {
  return typeof window < "u" && !!window.studioIPC;
}
async function ya(s, l = {}) {
  if (console.log("isElectron", Rl()), Rl()) {
    const d = await window.studioIPC.axiosFetch(s, l);
    if (d.error) {
      if (d.status === 401) {
        const p = new CustomEvent("api-unauthorized", {
          detail: { error: d.error },
          bubbles: !0,
          cancelable: !0
        });
        document.dispatchEvent(p);
      }
      throw new Error(d.error);
    }
    return d;
  } else
    return await tc({ url: s, ...l });
}
async function Ur(s, l) {
  return ya(s, { ...l, method: "GET" });
}
function br(s, l, d) {
  return ya(s, { ...d, method: "POST", data: l });
}
function E1(s, l, d) {
  return ya(s, { ...d, method: "PUT", data: l });
}
function N1(s, l) {
  return ya(s, { ...l, method: "DELETE" });
}
function My(s, l = {}, d, p, h, f) {
  let v = new AbortController(), w = !1, S = null;
  return (async () => {
    try {
      const b = await fetch(s, {
        method: l.method ?? "GET",
        headers: l.headers,
        body: l.body,
        signal: v.signal
      });
      if (!b.ok && (b.status === 400 || b.status === 406)) {
        console.log(
          `[SSE] Server returned ${b.status} for SSE request, retrying with Accept: application/json`
        );
        const H = await fetch(s, {
          method: l.method ?? "GET",
          headers: {
            ...l.headers,
            Accept: "application/json"
          },
          body: l.body,
          signal: v.signal
        });
        if (!H.ok) {
          let M = `Request failed: ${H.status}`;
          try {
            const F = await H.json();
            F.error ? M = F.error : F.message ? M = F.message : F.detail ? M = F.detail : M = `Request failed: ${H.status} - ${JSON.stringify(F)}`;
          } catch {
            try {
              const J = await H.text();
              J && (M = `Request failed: ${H.status} - ${J}`);
            } catch {
            }
          }
          throw new Error(M);
        }
        h?.();
        const U = await H.json();
        d(
          new MessageEvent("agent-event", {
            data: JSON.stringify(U)
          })
        ), w || f?.();
        return;
      }
      if (!b.ok || !b.body)
        throw new Error(`SSE failed: ${b.status}`);
      if (h?.(), (b.headers.get("Content-Type") ?? "").includes("application/json")) {
        console.log(
          "[SSE] Server responded with JSON (SSE not supported), handling as fallback"
        );
        const H = await b.json();
        d(
          new MessageEvent("agent-event", {
            data: JSON.stringify(H)
          })
        ), w || f?.();
        return;
      }
      S = b.body?.getReader();
      const T = new TextDecoder();
      if (!S)
        throw new Error("Response body is not readable");
      let x = "", L = "message", G = [];
      for (; !w; ) {
        const { value: H, done: U } = await S.read();
        if (U) break;
        x += T.decode(H, { stream: !0 });
        const M = x.split(`
`);
        x = M.pop() ?? "";
        for (const F of M) {
          const J = F.trimEnd();
          if (J === "") {
            G.length > 0 && (d(
              new MessageEvent(L, {
                data: G.join(`
`)
              })
            ), G = [], L = "message");
            continue;
          }
          J.startsWith(":") || (J.startsWith("event:") ? L = J.slice(6).trim() : J.startsWith("data:") && G.push(J.slice(5).trim()));
        }
      }
      w || f?.();
    } catch (b) {
      !w && b.name !== "AbortError" && (console.error("SSE connection error:", b), p(b));
    } finally {
      if (S)
        try {
          S.releaseLock();
        } catch {
        }
    }
  })(), {
    close: () => {
      w = !0, v.abort(), S && S.cancel().catch(() => {
      });
    }
  };
}
const ic = "custom_http_headers", Bs = "custom_host_url", Fs = "custom_agent_type", js = () => {
  try {
    const s = localStorage.getItem(ic);
    return s ? JSON.parse(s) : [];
  } catch (s) {
    return console.error("Error reading custom headers from storage:", s), [];
  }
}, Dy = (s) => {
  try {
    localStorage.setItem(ic, JSON.stringify(s));
  } catch (l) {
    console.error("Error saving custom headers to storage:", l);
  }
}, lc = (s) => s.reduce(
  (l, d) => (d.key && d.value && (l[d.key] = d.value), l),
  {}
), cc = () => {
  try {
    return localStorage.getItem(Bs);
  } catch (s) {
    return console.error("Error reading custom host URL from storage:", s), null;
  }
}, Ry = (s) => {
  try {
    s ? localStorage.setItem(Bs, s) : localStorage.removeItem(Bs);
  } catch (l) {
    console.error("Error saving custom host URL to storage:", l);
  }
}, zl = () => {
  try {
    return localStorage.getItem(Fs);
  } catch (s) {
    return console.error("Error reading custom agent type from storage:", s), null;
  }
}, zy = (s) => {
  try {
    s ? localStorage.setItem(Fs, s) : localStorage.removeItem(Fs);
  } catch (l) {
    console.error("Error saving custom agent type to storage:", l);
  }
}, Ly = "arraybuffer";
class Oy {
  BASE_URL;
  // for APIC commands - not in use atm
  API_URL;
  // for agent backend
  TOKEN;
  USER;
  PORG;
  FRONTEND_CONTEXT;
  AUTH_CONTEXT;
  cachedCustomHeaders = null;
  programmaticHeaders = {};
  constructor(l, d, p, h, f, v, w, S) {
    this.BASE_URL = l, this.API_URL = l + Uy(d), this.TOKEN = p, this.USER = h, this.PORG = f, this.FRONTEND_CONTEXT = v, this.AUTH_CONTEXT = w, this.programmaticHeaders = S || {}, this.loadCustomHeaders();
  }
  setPorg(l) {
    this.PORG = l;
  }
  /**
   * Load custom headers from localStorage and cache them
   * @private
   */
  loadCustomHeaders() {
    this.cachedCustomHeaders = lc(js());
  }
  /**
   * Get cached custom headers, loading them if not already cached
   * @private
   */
  getCustomHeadersCached() {
    return this.cachedCustomHeaders === null && this.loadCustomHeaders(), this.cachedCustomHeaders;
  }
  /**
   * Refresh the custom headers cache from localStorage
   * Call this method after headers are updated in the UI
   * @public
   */
  refreshCustomHeaders() {
    this.loadCustomHeaders();
  }
  getDefaultHeaders(l, d) {
    const p = this.getCustomHeadersCached();
    return {
      headers: {
        // allow custom Authorization header to override default token
        Authorization: p.Authorization ?? `Bearer ${this.TOKEN}`,
        "Content-Type": "application/json",
        // allow custom headers to override default values if provided
        "X-ibm-user": p["X-ibm-user"] ?? this.USER,
        "X-ibm-org": p["X-ibm-org"] ?? this.PORG,
        "X-ibm-agent-frontend-client": l?.client ?? this.FRONTEND_CONTEXT?.client,
        "X-ibm-agent-frontend-version": l?.version ?? this.FRONTEND_CONTEXT?.version,
        "X-ibm-agent-frontend-context": p["X-ibm-agent-frontend-context"] ?? l?.context ?? this.FRONTEND_CONTEXT?.context,
        "X-ibm-agent-auth-context": p["X-ibm-agent-auth-context"] ?? d?.auth_values ?? this.AUTH_CONTEXT?.auth_values,
        // merge programmatic headers (set at construction time)
        ...this.programmaticHeaders,
        // merge remaining custom headers (UI-configured, highest priority)
        ...p
      }
    };
  }
  getOctetHeaders(l, d, p) {
    const h = this.getCustomHeadersCached();
    return {
      headers: {
        // allow custom Authorization header to override default token
        Authorization: h.Authorization ?? `Bearer ${this.TOKEN}`,
        "Content-Type": "application/octet-stream",
        "Content-Disposition": `attachment; filename="${l}"`,
        // Allow custom headers to override default values if provided
        "X-ibm-user": h["X-ibm-user"] ?? this.USER,
        "X-ibm-org": h["X-ibm-org"] ?? this.PORG,
        // add frontend context to header - allow custom headers to override
        "X-ibm-agent-frontend-client": h["X-ibm-agent-frontend-client"] ?? d?.client ?? this.FRONTEND_CONTEXT?.client,
        "X-ibm-agent-frontend-version": h["X-ibm-agent-frontend-version"] ?? d?.version ?? this.FRONTEND_CONTEXT?.version,
        "X-ibm-agent-frontend-context": h["X-ibm-agent-frontend-context"] ?? d?.context ?? this.FRONTEND_CONTEXT?.context,
        // add auth context to header - allow custom headers to override
        "X-ibm-agent-auth-context": h["X-ibm-agent-auth-context"] ?? p?.auth_values ?? this.AUTH_CONTEXT?.auth_values,
        // merge programmatic headers (set at construction time)
        ...this.programmaticHeaders,
        // merge remaining custom headers (UI-configured, highest priority)
        ...h
      }
    };
  }
  getAttachmentsHeader(l, d) {
    const p = this.getCustomHeadersCached();
    return {
      headers: {
        accept: "application/octet-stream",
        // allow custom Authorization header to override default token
        Authorization: p.Authorization ?? `Bearer ${this.TOKEN}`,
        // Allow custom headers to override default values if provided
        "X-ibm-user": p["X-ibm-user"] ?? this.USER,
        "X-ibm-org": p["X-ibm-org"] ?? this.PORG,
        // add frontend context to header - allow custom headers to override
        "X-ibm-agent-frontend-client": p["X-ibm-agent-frontend-client"] ?? l?.client ?? this.FRONTEND_CONTEXT?.client,
        "X-ibm-agent-frontend-version": p["X-ibm-agent-frontend-version"] ?? l?.version ?? this.FRONTEND_CONTEXT?.version,
        "X-ibm-agent-frontend-context": p["X-ibm-agent-frontend-context"] ?? l?.context ?? this.FRONTEND_CONTEXT?.context,
        // add auth context to header - allow custom headers to override
        "X-ibm-agent-auth-context": p["X-ibm-agent-auth-context"] ?? d?.auth_values ?? this.AUTH_CONTEXT?.auth_values,
        // merge programmatic headers (set at construction time)
        ...this.programmaticHeaders,
        // merge remaining custom headers (UI-configured, highest priority)
        ...p
      },
      params: {},
      responseType: Ly
    };
  }
  async getAllChats(l, d) {
    try {
      const { data: p, headers: h } = await Ur(
        this.API_URL + "/v1/chats",
        this.getDefaultHeaders(l, d)
      );
      return console.debug(
        "getAllChats response body: ",
        p,
        ", headers: ",
        h
      ), {
        data: p,
        headers: new Map(Object.entries(h))
      };
    } catch (p) {
      throw console.error("getAllChats error: ", p), p;
    }
  }
  async createNewChat(l, d) {
    try {
      const { data: p, headers: h } = await br(
        this.API_URL + "/v1/chats",
        { type: "user-message", message: "" },
        this.getDefaultHeaders(l, d)
      );
      return console.debug(
        "createNewChat response body: ",
        p,
        ", headers: ",
        h
      ), {
        data: p,
        headers: new Map(Object.entries(h))
      };
    } catch (p) {
      throw console.error("createNewChat error: ", p), p;
    }
  }
  async getChat(l, d, p) {
    try {
      const { data: h, headers: f } = await Ur(
        this.API_URL + "/v1/chats/" + l,
        this.getDefaultHeaders(d, p)
      );
      return {
        data: h,
        headers: new Map(Object.entries(f))
      };
    } catch (h) {
      throw console.error("getChat error: ", h), h;
    }
  }
  async postChat(l, d, p, h, f) {
    try {
      console.debug("postChat request message: ", d);
      const { data: v, headers: w } = await br(
        this.API_URL + "/v1/chats/" + l,
        { type: "user-message", message: d, artifacts: p },
        this.getDefaultHeaders(h, f)
      );
      return console.debug(
        "postChat response body: ",
        v,
        ", headers: ",
        w
      ), {
        data: v,
        headers: new Map(Object.entries(w))
      };
    } catch (v) {
      throw console.error("postChat error: ", v), v;
    }
  }
  async postPlan(l, d, p, h) {
    try {
      console.debug("postPlan request: ", {
        chat_session_uuid: l,
        toolcalls: d
      });
      const { data: f, headers: v } = await br(
        this.API_URL + "/v1/chats/" + l,
        { type: "user-plan", toolcalls: d },
        this.getDefaultHeaders(p, h)
      );
      return console.debug(
        "postPlan response body: ",
        f,
        ", headers: ",
        v
      ), {
        data: f,
        headers: new Map(Object.entries(v))
      };
    } catch (f) {
      throw console.error("postPlan error: ", f), f;
    }
  }
  // submit selection index from carousel
  async postSelection(l, d, p, h) {
    try {
      console.debug("postSelection request: ", {
        chat_session_uuid: l,
        selected: d
      });
      const { data: f, headers: v } = await br(
        this.API_URL + "/v1/chats/" + l,
        { type: "selection-response", selected: d },
        this.getDefaultHeaders(p, h)
      );
      return console.debug(
        "postSelection response body: ",
        f,
        ", headers: ",
        v
      ), {
        data: f,
        headers: new Map(Object.entries(v))
      };
    } catch (f) {
      throw console.error("postSelection error: ", f), f;
    }
  }
  // prompt input key-value pairs
  async postUserCommand(l, d, p, h, f) {
    try {
      console.debug("postUserCommand request: ", {
        chat_session_uuid: l,
        command: d,
        args: p
      });
      const { data: v, headers: w } = await br(
        this.API_URL + "/v1/chats/" + l,
        {
          type: "user-command",
          command: d,
          args: p
        },
        this.getDefaultHeaders(h, f)
      );
      return console.debug(
        "postUserCommand response body: ",
        v,
        ", headers: ",
        w
      ), {
        data: v,
        headers: new Map(Object.entries(w))
      };
    } catch (v) {
      throw console.error("postUserCommand error: ", v), v;
    }
  }
  async getCommands(l, d, p) {
    try {
      const { data: h, headers: f } = await Ur(
        this.API_URL + "/v1/chats/" + l + "/commands",
        this.getDefaultHeaders(d, p)
      );
      return console.debug(
        "getCommands response body: ",
        h,
        ", headers: ",
        f
      ), {
        data: h,
        headers: new Map(Object.entries(f))
      };
    } catch (h) {
      throw console.error("getCommands error: ", h), h;
    }
  }
  async getAttachments(l, d, p, h) {
    try {
      const f = this.getAttachmentsHeader(
        p,
        h
      );
      f.params = {
        artifact_id: d
      };
      const { data: v, headers: w } = await Ur(
        this.API_URL + "/v1/chats/" + l + "/attachments",
        f
      );
      return console.debug(
        "getAttachments response type: ",
        typeof v,
        ", headers: ",
        w
      ), {
        data: v,
        headers: new Map(Object.entries(w))
      };
    } catch (f) {
      throw console.error("getAttachments error: ", f), f;
    }
  }
  async postAttachment(l, d, p, h, f) {
    try {
      console.log("postAttachment request");
      const { data: v, headers: w } = await br(
        this.API_URL + "/v1/chats/" + l + "/attachments",
        d,
        this.getOctetHeaders(p, h, f)
      );
      return console.debug(
        "postAttachment response body: ",
        v,
        ", headers: ",
        w
      ), {
        data: v,
        headers: new Map(Object.entries(w))
      };
    } catch (v) {
      throw console.error("postAttachment error: ", v), v;
    }
  }
  async fetchOrgs() {
    try {
      const { data: l, headers: d } = await Ur(this.API_URL + "/orgs", {
        headers: {
          Authorization: "Bearer " + this.TOKEN
        }
      });
      return {
        data: l,
        headers: new Map(Object.entries(d))
      };
    } catch (l) {
      throw console.error("fetchOrgs error: ", l), l;
    }
  }
  // Post message to /message endpoint
  async postMessage(l, d, p, h) {
    try {
      console.debug("postMessage request: ", l);
      const { data: f, headers: v } = await br(
        this.API_URL + "/v1/chats/" + d + "/messages",
        { type: "user-message", message: l, artifacts: [] },
        this.getDefaultHeaders(p, h)
      );
      return console.debug(
        "postMessage response body: ",
        f,
        ", headers: ",
        v
      ), {
        data: f,
        headers: new Map(Object.entries(v))
      };
    } catch (f) {
      throw console.error("postMessage error: ", f), f;
    }
  }
  /**
   * Creates a streaming connection for real-time updates.
   * If the SSE fails, do the 'application/json' for standard postChat()
   * The server will respond with SSE if supported, or JSON if not.
   * @param chat_session_uuid The chat session UUID
   * @param message The message to send
   * @param attachments The attachments to send
   * @param onMessageCallback
   * @param onErrorCallback
   * @param onOpenCallback
   * @param context Frontend context
   * @param authContext Authentication context
   * @returns Object with close() to terminate the connection
   */
  streamChat(l, d, p, h, f, v, w, S, N) {
    console.debug("streamChat request message: ", d);
    const b = `${this.API_URL}/v1/chats/${l}`, C = this.getDefaultHeaders(S, N);
    C.headers = {
      ...C.headers,
      Accept: "text/event-stream, application/json"
    };
    const { close: T } = My(
      b,
      {
        ...C,
        method: "POST",
        body: JSON.stringify({
          type: "user-message",
          message: d,
          artifacts: p
        })
      },
      h,
      f,
      v,
      w
    );
    return { close: T };
  }
}
function Uy(s) {
  if (!s) return "";
  const l = s.replace(/^\/+/, "").replace(/\/+$/, "");
  return l ? `/${l}` : "";
}
const uc = fa(void 0), H1 = ({ children: s }) => {
  const [l, d] = R(null), [p, h] = R(""), [f, v] = R(!1), [w, S] = R(!1), N = (C, T, x, L, G, H, U, M) => {
    const J = cc() || C, j = new Oy(
      J,
      T,
      x,
      L,
      G,
      H,
      U,
      M
    );
    d(j);
  }, b = wr(
    () => ({
      apiService: l,
      setApiService: d,
      configureService: N,
      porg: p,
      setPorg: h,
      hidePorg: f,
      setHidePorg: v,
      isPorgError: w,
      setIsPorgError: S
    }),
    [l, p, f, w]
  );
  return /* @__PURE__ */ o(uc.Provider, { value: b, children: s });
}, Ar = () => {
  const s = ma(uc);
  if (!s)
    throw new Error("useAPI must be used within an APIProvider");
  return s;
}, By = (s) => {
  const { chatUUID: l, attachmentId: d, title: p, description: h, fileName: f, frontendClient: v } = s, w = Ar(), S = s.apiService !== void 0 ? s.apiService : w.apiService, [N, b] = R(null), [C, T] = R(null), x = tt(null), L = async () => {
    if (!x.current) {
      if (!S)
        throw new Error("APIService is not available.");
      x.current = S.getAttachments(l, d).then((U) => {
        if (!U?.data)
          throw new Error("Received invalid response.");
        return U.data;
      }).then((U) => (b(U), U)).catch((U) => {
        T(U.message);
      });
    }
    return x.current;
  }, G = async () => {
    try {
      const U = N ?? await L();
      if (!U)
        throw new Error();
      const M = Hl(f), F = new Blob([U], {
        type: "application/" + M
      }), J = document.createElement("a");
      J.href = window.URL.createObjectURL(F), J.download = f, J.click(), T(null);
    } catch {
      T("Download failed.");
    }
  }, H = async () => {
    try {
      const U = N ?? await L();
      if (!U)
        throw new Error();
      const M = new TextDecoder().decode(U);
      await navigator.clipboard.writeText(M), T(null);
    } catch {
      T("Failed to copy contents of file to clipboard.");
    }
  };
  return /* @__PURE__ */ _("div", { className: "file-download-container", children: [
    /* @__PURE__ */ _("div", { className: "file-download-card", children: [
      /* @__PURE__ */ o("div", { className: "file-extension", children: Hl(f)?.toUpperCase() ?? "FILE" }),
      /* @__PURE__ */ _("div", { className: "file-download-card-main", children: [
        /* @__PURE__ */ _("div", { children: [
          /* @__PURE__ */ o("div", { className: "file-title", children: p || f }),
          /* @__PURE__ */ o("div", { className: "file-description", children: h ?? "Proposed file." })
        ] }),
        /* @__PURE__ */ o("div", { children: /* @__PURE__ */ o(
          Re,
          {
            className: "file-download-text-button",
            kind: "ghost",
            onClick: G,
            children: f
          }
        ) })
      ] })
    ] }),
    /* @__PURE__ */ _("div", { className: "file-download-footer", children: [
      /* @__PURE__ */ o(
        Us,
        {
          label: "Copy",
          onClick: H,
          size: "sm",
          align: "bottom",
          enterDelayMs: 250,
          leaveDelayMs: 0,
          debounce: !0,
          children: /* @__PURE__ */ o(Ql, {})
        }
      ),
      /* @__PURE__ */ o(
        Us,
        {
          label: v?.client !== "vscode" ? "Download" : `Download
            Note: Changes to workspace files (e.g., downloads, updates, deletions) may not be immediately reflected.
            To view the latest state, please refresh the plugin via:
            - Command Palette → API Agent: Refresh Webview
            - Or switch to another tab (e.g., Explorer) and return.`,
          onClick: G,
          size: "sm",
          align: "bottom",
          enterDelayMs: v?.client === "vscode" ? 500 : 250,
          leaveDelayMs: v?.client === "vscode" ? 300 : 0,
          debounce: !0,
          children: /* @__PURE__ */ o(Ev, {})
        }
      )
    ] }),
    C && /* @__PURE__ */ _("div", { className: "download-error", children: [
      /* @__PURE__ */ o(Js, {}),
      /* @__PURE__ */ o("span", { className: "download-error-text", children: C })
    ] })
  ] });
}, Fy = ({
  chatUUID: s,
  attachments: l,
  frontendClient: d,
  apiService: p
}) => l.length ? /* @__PURE__ */ o(Ht, { children: l.map((h) => /* @__PURE__ */ o(
  By,
  {
    chatUUID: s,
    attachmentId: h.artifact_id,
    title: h.label || h.filename,
    description: h.description,
    fileName: h.filename,
    frontendClient: d,
    apiService: p
  },
  h.artifact_id
)) }) : null, jy = ({
  executed_toolcalls: s,
  planned_toolcalls: l
}) => {
  const { isDarkTheme: d } = dt();
  return s?.length || l?.length ? /* @__PURE__ */ o("div", { className: `steps ${d ? "steps-dark" : "steps-light"}`, children: /* @__PURE__ */ o(
    Zs,
    {
      executed_toolcalls: s || [],
      planned_toolcalls: l || []
    }
  ) }) : null;
}, $y = ({
  chatUUID: s,
  reqId: l,
  debugResponse: d,
  idDetailType: p,
  expandDetails: h,
  setExpandDetails: f
}) => /* @__PURE__ */ _(
  ga,
  {
    open: h,
    modalHeading: _y(p),
    modalAriaLabel: "show message details modal",
    passiveModal: !0,
    size: "xs",
    className: "show-id-to-copy-modal",
    onRequestClose: () => f(!1),
    children: [
      p === "chatUUID" && /* @__PURE__ */ _("div", { children: [
        s ?? "undefined",
        /* @__PURE__ */ o(
          da,
          {
            "data-modal-primary-focus": !0,
            iconDescription: "Copy chat session ID",
            feedback: "Copied successfully",
            align: "left",
            onClick: () => navigator.clipboard.writeText(s)
          }
        )
      ] }),
      p === "reqID" && /* @__PURE__ */ _("div", { children: [
        l && l.trim() !== "" ? l : "undefined",
        /* @__PURE__ */ o(
          da,
          {
            "data-modal-primary-focus": !0,
            iconDescription: "Copy request ID",
            feedback: "Copied successfully",
            align: "left",
            onClick: () => navigator.clipboard.writeText(l)
          }
        )
      ] }),
      p === "debug" && /* @__PURE__ */ _("div", { children: [
        d,
        /* @__PURE__ */ o(
          da,
          {
            "data-modal-primary-focus": !0,
            iconDescription: "Copy debug logs",
            feedback: "Copied successfully",
            align: "left",
            onClick: () => navigator.clipboard.writeText(d)
          }
        )
      ] })
    ]
  }
), Ys = ({ fill: s }) => /* @__PURE__ */ _(
  "svg",
  {
    id: "watsonx",
    height: "28px",
    width: "28px",
    xmlns: "http://www.w3.org/2000/svg",
    viewBox: "0 0 32 32",
    children: [
      /* @__PURE__ */ _("defs", { children: [
        /* @__PURE__ */ _(
          "linearGradient",
          {
            id: "8913t7g6za",
            x1: "1196.653",
            y1: "2930.892",
            x2: "1209.953",
            y2: "2912.832",
            gradientTransform: "matrix(.8312 .55596 -.27409 .40979 -188.767 -1860.755)",
            gradientUnits: "userSpaceOnUse",
            children: [
              /* @__PURE__ */ o("stop", { offset: ".3" }),
              /* @__PURE__ */ o(
                "stop",
                {
                  offset: "1",
                  stopOpacity: "0"
                }
              )
            ]
          }
        ),
        /* @__PURE__ */ _(
          "linearGradient",
          {
            id: "woevpxiuib",
            x1: "1299.261",
            y1: "2844.072",
            x2: "1310.351",
            y2: "2829.012",
            gradientTransform: "rotate(146.223 440.869 -882.286) scale(1 -.493)",
            gradientUnits: "userSpaceOnUse",
            children: [
              /* @__PURE__ */ o("stop", { offset: ".3" }),
              /* @__PURE__ */ o(
                "stop",
                {
                  offset: ".9",
                  stopOpacity: "0"
                }
              )
            ]
          }
        ),
        /* @__PURE__ */ _(
          "linearGradient",
          {
            id: "je2bg9iagc",
            x1: "-4885.16",
            y1: "-20230.559",
            x2: "-4871.86",
            y2: "-20248.618",
            gradientTransform: "rotate(-146.223 -911.421 -5714.55) scale(1 .493)",
            gradientUnits: "userSpaceOnUse",
            children: [
              /* @__PURE__ */ o("stop", { offset: ".32" }),
              /* @__PURE__ */ o(
                "stop",
                {
                  offset: ".354",
                  stopOpacity: ".798"
                }
              ),
              /* @__PURE__ */ o(
                "stop",
                {
                  offset: ".7",
                  stopOpacity: "0"
                }
              )
            ]
          }
        ),
        /* @__PURE__ */ _(
          "linearGradient",
          {
            id: "2co5q30b1e",
            x1: "0",
            y1: "32",
            x2: "32",
            y2: "0",
            gradientUnits: "userSpaceOnUse",
            children: [
              /* @__PURE__ */ o(
                "stop",
                {
                  offset: ".1",
                  stopColor: "#be95ff"
                }
              ),
              /* @__PURE__ */ o(
                "stop",
                {
                  offset: ".9",
                  stopColor: "#4589ff"
                }
              )
            ]
          }
        ),
        /* @__PURE__ */ _(
          "mask",
          {
            id: "brch21jdod",
            x: "0",
            y: "0",
            width: "32",
            height: "32",
            maskUnits: "userSpaceOnUse",
            children: [
              /* @__PURE__ */ o(
                "path",
                {
                  d: "M16 1A14.915 14.915 0 0 0 5.502 5.286l1.4 1.429A12.922 12.922 0 0 1 16 3.001c.977 0 1.929.109 2.845.315-3.402.921-5.916 4.026-5.916 7.715 0 .782.118 1.537.328 2.252a7.978 7.978 0 0 0-2.188-.312c-3.704 0-6.819 2.534-7.726 5.957a12.954 12.954 0 0 1-.345-2.927c0-2.117.492-4.134 1.462-5.996l-1.773-.924A15.037 15.037 0 0 0 .999 16c0 8.271 6.729 15 15 15 3.949 0 7.678-1.522 10.498-4.286l-1.4-1.428A12.926 12.926 0 0 1 15.999 29c-3.648 0-6.945-1.516-9.309-3.945a5.959 5.959 0 0 1-1.621-4.086c0-3.309 2.691-6 6-6a6.006 6.006 0 0 1 5.897 7.107l1.967.367a7.971 7.971 0 0 0-.192-3.726 7.976 7.976 0 0 0 2.187.312c3.71 0 6.829-2.542 7.73-5.974.22.947.34 1.931.34 2.944 0 2.117-.492 4.134-1.462 5.995l1.773.924a15.034 15.034 0 0 0 1.688-6.919c0-8.271-6.729-15-15-15zm4.93 16.03c-3.309 0-6-2.692-6-6s2.691-6 6-6 6 2.691 6 6-2.691 6-6 6z",
                  style: { fill: "#fff", strokeWidth: 0 }
                }
              ),
              /* @__PURE__ */ o(
                "path",
                {
                  style: { fill: "url(#8913t7g6za)", strokeWidth: 0 },
                  d: "M8 9 0 0h16l2.305 3.305L8 9z"
                }
              ),
              /* @__PURE__ */ o(
                "path",
                {
                  style: { fill: "url(#woevpxiuib)", strokeWidth: 0 },
                  d: "m12 31 4.386-9L6 21 2 31h10z"
                }
              ),
              /* @__PURE__ */ o(
                "path",
                {
                  style: { fill: "url(#je2bg9iagc)", strokeWidth: 0 },
                  d: "m24 23 8 9H16l-2.305-3.305L24 23z"
                }
              ),
              /* @__PURE__ */ o(
                "path",
                {
                  style: { strokeWidth: 0 },
                  d: "M16 31h-4.283L15 22h2l-1 9z"
                }
              )
            ]
          }
        )
      ] }),
      /* @__PURE__ */ o("g", { style: { mask: "url(#brch21jdod)", strokeWidth: 0 }, children: /* @__PURE__ */ o(
        "path",
        {
          style: { fill: "url(#2co5q30b1e)", strokeWidth: 0 },
          d: "M0 0h32v32H0z"
        }
      ) }),
      /* @__PURE__ */ o(
        "circle",
        {
          cx: "6",
          cy: "6",
          r: "2",
          style: { fill: s, strokeWidth: 0 }
        }
      ),
      /* @__PURE__ */ o(
        "circle",
        {
          cx: "26",
          cy: "26",
          r: "2",
          style: { fill: s, strokeWidth: 0 }
        }
      ),
      /* @__PURE__ */ o(
        "path",
        {
          d: "M16 31c-2.757 0-5-2.243-5-5s2.243-5 5-5 5 2.243 5 5-2.243 5-5 5zm0-8c-1.654 0-3 1.346-3 3s1.346 3 3 3 3-1.346 3-3-1.346-3-3-3z",
          style: { fill: s, strokeWidth: 0 }
        }
      )
    ]
  }
), qy = ({
  timestamp: s,
  isDarkTheme: l,
  showSteps: d,
  showReasoning: p,
  expandSteps: h,
  setExpandSteps: f,
  expandReasoning: v,
  setExpandReasoning: w,
  debugResponse: S,
  setExpandDetails: N,
  setIdDetailType: b
}) => {
  const { t: C } = vn();
  return /* @__PURE__ */ _("header", { className: "sender-type", children: [
    /* @__PURE__ */ o(Ys, { fill: l ? "#ffffff" : "#000000" }),
    /* @__PURE__ */ _("span", { className: "bot-header", children: [
      "watsonx ",
      s,
      " ",
      (d || p) && /* @__PURE__ */ o("span", { className: "pipe-separator", children: "|" })
    ] }),
    d && /* @__PURE__ */ _(
      Re,
      {
        kind: "ghost",
        className: "show-steps-toggle",
        onClick: () => f((T) => !T),
        children: [
          C(h ? "messageHeader.hideSteps" : "messageHeader.showSteps"),
          " ",
          /* @__PURE__ */ o(
            El,
            {
              className: `${l ? "isDark" : "isLight"} ${h ? "rotated" : ""}`
            }
          )
        ]
      }
    ),
    p && /* @__PURE__ */ _(
      Re,
      {
        kind: "ghost",
        className: "show-steps-toggle",
        onClick: () => w((T) => !T),
        children: [
          C(v ? "messageHeader.hideScratchpad" : "messageHeader.showScratchpad"),
          " ",
          /* @__PURE__ */ o(
            El,
            {
              className: `${l ? "isDark" : "isLight"} ${v ? "rotated" : ""}`
            }
          )
        ]
      }
    ),
    /* @__PURE__ */ _(
      $l,
      {
        "aria-label": "overflow-menu",
        flipped: !0,
        renderIcon: () => /* @__PURE__ */ o(Nv, {}),
        className: "agent-ui-overflow-menu",
        children: [
          /* @__PURE__ */ o(
            Ot,
            {
              className: "agent-ui-menu-item",
              itemText: C("messageHeader.chatSessionId"),
              onClick: () => {
                N(!0), b("chatUUID");
              }
            }
          ),
          /* @__PURE__ */ o(
            Ot,
            {
              className: "agent-ui-menu-item",
              itemText: C("messageHeader.requestId"),
              onClick: () => {
                N(!0), b("reqID");
              }
            }
          ),
          S && /* @__PURE__ */ o(
            Ot,
            {
              className: "agent-ui-menu-item",
              itemText: C("messageHeader.debug"),
              onClick: () => {
                N(!0), b("debug");
              }
            }
          )
        ]
      }
    )
  ] });
}, Wy = ({ reasoning: s }) => s ? /* @__PURE__ */ o("div", { className: "reasoning-block", children: /* @__PURE__ */ o("span", { className: "reasoning-content", children: /* @__PURE__ */ o(
  Kl,
  {
    remarkPlugins: [Zl],
    rehypePlugins: [Jl],
    className: "markdown",
    children: s
  }
) }) }) : null, M1 = ({
  msg: s,
  isLatestMessage: l,
  chatUUID: d,
  onSave: p,
  onSaveSelection: h,
  setIsEditPage: f,
  isDarkTheme: v,
  frontendClient: w,
  RemoteDomRenderer: S,
  useTextualPlan: N = !0
}) => {
  const { event: b, headers: C } = s, [T, x] = R(!1), [L, G] = R(!1), [H, U] = R(!1), [M, F] = R("reqID");
  let J = "";
  C !== void 0 && (J = C.get("x-request-id"));
  const {
    isAgent: j,
    isOnlyAgentMessage: se,
    isSelectionMessage: te,
    isUser: de,
    isUserMessage: ne,
    isUserCommand: B,
    isPlanEvent: z,
    isFirstMessage: $
  } = Ay(b);
  let he = [], Ae = [], ye = [], Ne = "";
  (j || se) && (Ae = b.suggested_actions ?? [], $ && (ye = b.first_actions ?? []), he = b.response_details?.flatMap(
    (le) => le.artifacts || []
  ) ?? [], j && (Ne = b.response_details?.length > 0 && by(b.response_details)), se && b.system_response && (Ne = b.system_response));
  const Ce = (le) => z && le.reasoning, Le = (le) => z && Cy(le), ae = () => S ? /* @__PURE__ */ o(
    S,
    {
      url: Iy(b) ?? "",
      height: "400px",
      width: "100%",
      isDarkTheme: v,
      details: b.response_details
    }
  ) : /* @__PURE__ */ o(
    "div",
    {
      style: {
        height: "400px",
        width: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        border: "1px solid #e0e0e0",
        padding: "16px",
        borderRadius: "4px",
        backgroundColor: v ? "#1e1e1e" : "#ffffff",
        color: v ? "#ffffff" : "#333333"
      },
      children: "RemoteDomRenderer component not provided"
    }
  );
  return /* @__PURE__ */ _("div", { className: `message ${de ? "user" : "bot"}`, children: [
    de && /* @__PURE__ */ _("p", { className: "sender-type", children: [
      "You ",
      s.timestamp
    ] }),
    !de && /* @__PURE__ */ o(
      qy,
      {
        timestamp: s.timestamp,
        isDarkTheme: v,
        showSteps: Le(s.event),
        showReasoning: Ce(s.event),
        expandSteps: T,
        setExpandSteps: x,
        expandReasoning: L,
        setExpandReasoning: G,
        debugResponse: Ne,
        setExpandDetails: U,
        setIdDetailType: F
      }
    ),
    Le(s.event) && /* @__PURE__ */ o(Dl, { open: T, children: /* @__PURE__ */ o(
      jy,
      {
        executed_toolcalls: b.executed_toolcalls,
        planned_toolcalls: b.planned_toolcalls
      }
    ) }),
    Ce(s.event) && /* @__PURE__ */ o(
      Dl,
      {
        className: "reasoning-container",
        open: L,
        children: /* @__PURE__ */ o(Wy, { reasoning: b.reasoning })
      }
    ),
    /* @__PURE__ */ _("div", { className: "chat-bubble", children: [
      (j || se || te) && /* @__PURE__ */ o(mn, { blockInfo: b.agent_message }),
      ne && b.message,
      B && b.command && wy(b.command, b.args),
      j && $ && ye.length > 0 && /* @__PURE__ */ o(Ty, { firstActionList: ye }),
      (j || te) && /* @__PURE__ */ _(Ht, { children: [
        /* @__PURE__ */ o(
          Hy,
          {
            details: b.response_details,
            isLatestMessage: l,
            onSaveSelection: h,
            eventType: b.type
          }
        ),
        Sy(b) && /* @__PURE__ */ o("div", { className: "remote-dom-container", children: ae() })
      ] }),
      !N && /* @__PURE__ */ o(
        ky,
        {
          event: b,
          isPlanEvent: z,
          isSelectionMessage: te,
          isLatestMessage: l
        }
      ),
      N && z && oc(b) && /* @__PURE__ */ o(
        vy,
        {
          title: b.plan_title ?? "Proposed Plan",
          event: b
        }
      ),
      !N && l && /* @__PURE__ */ o(
        my,
        {
          title: b.plan_title ?? "Proposed Plan",
          nonEditable: !l,
          onSave: p,
          setIsEditPage: f
        }
      ),
      (j || te) && /* @__PURE__ */ o(
        Fy,
        {
          chatUUID: d,
          attachments: he,
          frontendClient: w
        }
      ),
      (j || se) && !$ && Ae?.length > 0 && /* @__PURE__ */ o(
        Py,
        {
          nextActionList: Ae,
          nonEditable: !l
        }
      )
    ] }),
    /* @__PURE__ */ o(
      $y,
      {
        chatUUID: d,
        reqId: J,
        debugResponse: Ne,
        idDetailType: M,
        expandDetails: H,
        setExpandDetails: U
      }
    )
  ] });
}, D1 = ({
  isDarkTheme: s,
  showLoadingMessages: l = !0
}) => {
  const d = [
    "Running...",
    "One moment...",
    "Please wait...",
    "Loading up...",
    "Getting things ready...",
    "Loading...",
    "Fetching...",
    "Retrieving..."
  ], [p, h] = R(0);
  return Ee(() => {
    const f = setInterval(() => {
      h((v) => (v + 1) % d.length);
    }, 3e3);
    return () => clearInterval(f);
  }, []), /* @__PURE__ */ _("div", { className: "message bot", children: [
    /* @__PURE__ */ _("header", { children: [
      /* @__PURE__ */ o(Ys, { fill: s ? "#ffffff" : "#000000" }),
      /* @__PURE__ */ _("span", { className: "bot-header", children: [
        "watsonx ",
        gn()
      ] })
    ] }),
    /* @__PURE__ */ _("div", { className: "chat-bubble loading-content", children: [
      /* @__PURE__ */ o(
        Os,
        {
          active: !0,
          small: !0,
          description: "Loading",
          withOverlay: !1
        }
      ),
      l && /* @__PURE__ */ o("span", { children: d[p] })
    ] })
  ] });
}, R1 = ({
  streamingContent: s,
  streamingComplete: l,
  isDarkTheme: d,
  tailRef: p
}) => {
  const h = (() => {
    for (let v = s.length - 1; v >= 0; v--)
      if (s[v].type === "status-update") return v;
    return -1;
  })(), f = () => {
    const v = [];
    let w = "", S = -1;
    return s.forEach((N, b) => {
      N.type === "partial-output" ? (S === -1 && (S = b), w += N.text) : (w && (v.push(
        /* @__PURE__ */ o(
          mn,
          {
            blockInfo: w
          },
          `block-${S}`
        )
      ), w = "", S = -1), N.type === "status-update" && v.push(
        /* @__PURE__ */ _(
          "strong",
          {
            className: "status-update",
            children: [
              N.text,
              !l && b === h && /* @__PURE__ */ _(
                "span",
                {
                  className: "dots-fade",
                  "aria-hidden": "true",
                  children: [
                    /* @__PURE__ */ o("span", { className: "dot", children: "." }),
                    /* @__PURE__ */ o("span", { className: "dot", children: "." }),
                    /* @__PURE__ */ o("span", { className: "dot", children: "." })
                  ]
                }
              )
            ]
          },
          b
        )
      ));
    }), w && v.push(
      /* @__PURE__ */ o(
        mn,
        {
          blockInfo: w
        },
        `block-${S}`
      )
    ), v;
  };
  return /* @__PURE__ */ _("div", { className: "message bot", children: [
    /* @__PURE__ */ _("header", { className: "sender-type", children: [
      /* @__PURE__ */ o(Ys, { fill: d ? "#ffffff" : "#000000" }),
      /* @__PURE__ */ _("span", { className: "bot-header", children: [
        "watsonx ",
        (/* @__PURE__ */ new Date()).toLocaleTimeString()
      ] })
    ] }),
    /* @__PURE__ */ o("div", { className: "chat-bubble", children: /* @__PURE__ */ o("div", { className: "streaming-content", children: /* @__PURE__ */ _(
      "div",
      {
        className: `streaming-text ${l ? "complete" : ""}`,
        children: [
          f(),
          /* @__PURE__ */ o(
            "div",
            {
              ref: p,
              style: { height: 1, width: 1 }
            }
          )
        ]
      }
    ) }) })
  ] });
};
var ua = typeof globalThis < "u" ? globalThis : typeof window < "u" ? window : typeof global < "u" ? global : typeof self < "u" ? self : {}, hn = { exports: {} };
var Gy = hn.exports, Ll;
function Xy() {
  return Ll || (Ll = 1, (function(s, l) {
    (function() {
      function d(y, k, a) {
        switch (a.length) {
          case 0:
            return y.call(k);
          case 1:
            return y.call(k, a[0]);
          case 2:
            return y.call(k, a[0], a[1]);
          case 3:
            return y.call(k, a[0], a[1], a[2]);
        }
        return y.apply(k, a);
      }
      function p(y, k, a, V) {
        for (var oe = -1, K = y == null ? 0 : y.length; ++oe < K; ) {
          var st = y[oe];
          k(V, st, a(st), y);
        }
        return V;
      }
      function h(y, k) {
        for (var a = -1, V = y == null ? 0 : y.length; ++a < V && k(y[a], a, y) !== !1; ) ;
        return y;
      }
      function f(y, k) {
        for (var a = y == null ? 0 : y.length; a-- && k(y[a], a, y) !== !1; ) ;
        return y;
      }
      function v(y, k) {
        for (var a = -1, V = y == null ? 0 : y.length; ++a < V; ) if (!k(y[a], a, y)) return !1;
        return !0;
      }
      function w(y, k) {
        for (var a = -1, V = y == null ? 0 : y.length, oe = 0, K = []; ++a < V; ) {
          var st = y[a];
          k(st, a, y) && (K[oe++] = st);
        }
        return K;
      }
      function S(y, k) {
        return !!(y != null && y.length) && F(y, k, 0) > -1;
      }
      function N(y, k, a) {
        for (var V = -1, oe = y == null ? 0 : y.length; ++V < oe; ) if (a(k, y[V])) return !0;
        return !1;
      }
      function b(y, k) {
        for (var a = -1, V = y == null ? 0 : y.length, oe = Array(V); ++a < V; ) oe[a] = k(y[a], a, y);
        return oe;
      }
      function C(y, k) {
        for (var a = -1, V = k.length, oe = y.length; ++a < V; ) y[oe + a] = k[a];
        return y;
      }
      function T(y, k, a, V) {
        var oe = -1, K = y == null ? 0 : y.length;
        for (V && K && (a = y[++oe]); ++oe < K; ) a = k(a, y[oe], oe, y);
        return a;
      }
      function x(y, k, a, V) {
        var oe = y == null ? 0 : y.length;
        for (V && oe && (a = y[--oe]); oe--; ) a = k(a, y[oe], oe, y);
        return a;
      }
      function L(y, k) {
        for (var a = -1, V = y == null ? 0 : y.length; ++a < V; ) if (k(y[a], a, y)) return !0;
        return !1;
      }
      function G(y) {
        return y.split("");
      }
      function H(y) {
        return y.match(Kc) || [];
      }
      function U(y, k, a) {
        var V;
        return a(y, function(oe, K, st) {
          if (k(oe, K, st)) return V = K, !1;
        }), V;
      }
      function M(y, k, a, V) {
        for (var oe = y.length, K = a + (V ? 1 : -1); V ? K-- : ++K < oe; ) if (k(y[K], K, y)) return K;
        return -1;
      }
      function F(y, k, a) {
        return k === k ? ie(y, k, a) : M(y, j, a);
      }
      function J(y, k, a, V) {
        for (var oe = a - 1, K = y.length; ++oe < K; ) if (V(y[oe], k)) return oe;
        return -1;
      }
      function j(y) {
        return y !== y;
      }
      function se(y, k) {
        var a = y == null ? 0 : y.length;
        return a ? z(y, k) / a : wn;
      }
      function te(y) {
        return function(k) {
          return k == null ? c : k[y];
        };
      }
      function de(y) {
        return function(k) {
          return y == null ? c : y[k];
        };
      }
      function ne(y, k, a, V, oe) {
        return oe(y, function(K, st, Oa) {
          a = V ? (V = !1, K) : k(a, K, st, Oa);
        }), a;
      }
      function B(y, k) {
        var a = y.length;
        for (y.sort(k); a--; ) y[a] = y[a].c;
        return y;
      }
      function z(y, k) {
        for (var a, V = -1, oe = y.length; ++V < oe; ) {
          var K = k(y[V]);
          K !== c && (a = a === c ? K : a + K);
        }
        return a;
      }
      function $(y, k) {
        for (var a = -1, V = Array(y); ++a < y; ) V[a] = k(a);
        return V;
      }
      function he(y, k) {
        return b(k, function(a) {
          return [a, y[a]];
        });
      }
      function Ae(y) {
        return y && y.slice(0, X(y) + 1).replace(Ea, "");
      }
      function ye(y) {
        return function(k) {
          return y(k);
        };
      }
      function Ne(y, k) {
        return b(k, function(a) {
          return y[a];
        });
      }
      function Ce(y, k) {
        return y.has(k);
      }
      function Le(y, k) {
        for (var a = -1, V = y.length; ++a < V && F(k, y[a], 0) > -1; ) ;
        return a;
      }
      function ae(y, k) {
        for (var a = y.length; a-- && F(k, y[a], 0) > -1; ) ;
        return a;
      }
      function le(y, k) {
        for (var a = y.length, V = 0; a--; ) y[a] === k && ++V;
        return V;
      }
      function xe(y) {
        return "\\" + Eu[y];
      }
      function qe(y, k) {
        return y == null ? c : y[k];
      }
      function Ve(y) {
        return xu.test(y);
      }
      function ft(y) {
        return Su.test(y);
      }
      function Mt(y) {
        for (var k, a = []; !(k = y.next()).done; ) a.push(k.value);
        return a;
      }
      function Te(y) {
        var k = -1, a = Array(y.size);
        return y.forEach(function(V, oe) {
          a[++k] = [oe, V];
        }), a;
      }
      function xt(y, k) {
        return function(a) {
          return y(k(a));
        };
      }
      function Ke(y, k) {
        for (var a = -1, V = y.length, oe = 0, K = []; ++a < V; ) {
          var st = y[a];
          st !== k && st !== yn || (y[a] = yn, K[oe++] = a);
        }
        return K;
      }
      function rt(y) {
        var k = -1, a = Array(y.size);
        return y.forEach(function(V) {
          a[++k] = V;
        }), a;
      }
      function Je(y) {
        var k = -1, a = Array(y.size);
        return y.forEach(function(V) {
          a[++k] = [V, V];
        }), a;
      }
      function ie(y, k, a) {
        for (var V = a - 1, oe = y.length; ++V < oe; ) if (y[V] === k) return V;
        return -1;
      }
      function Ie(y, k, a) {
        for (var V = a + 1; V--; ) if (y[V] === k) return V;
        return V;
      }
      function pe(y) {
        return Ve(y) ? O(y) : Du(y);
      }
      function _e(y) {
        return Ve(y) ? q(y) : G(y);
      }
      function X(y) {
        for (var k = y.length; k-- && Wc.test(y.charAt(k)); ) ;
        return k;
      }
      function O(y) {
        for (var k = Ra.lastIndex = 0; Ra.test(y); ) ++k;
        return k;
      }
      function q(y) {
        return y.match(Ra) || [];
      }
      function I(y) {
        return y.match(Cu) || [];
      }
      var c, Z = "4.18.1", ce = 200, Se = "Unsupported core-js use. Try https://npms.io/search?q=ponyfill.", Q = "Expected a function", Ze = "Invalid `variable` option passed into `_.template`", Fe = "Invalid `imports` option passed into `_.template`", Yt = "__lodash_hash_undefined__", vc = 500, yn = "__lodash_placeholder__", Qt = 1, eo = 2, _r = 4, Cr = 1, bn = 2, St = 1, xr = 2, to = 4, Ut = 8, Br = 16, Bt = 32, Fr = 64, Ft = 128, jr = 256, ba = 512, yc = 30, bc = "...", wc = 800, Ac = 16, ro = 1, _c = 2, Cc = 3, lr = 1 / 0, er = 9007199254740991, xc = 17976931348623157e292, wn = NaN, Dt = 4294967295, Sc = Dt - 1, Ic = Dt >>> 1, kc = [["ary", Ft], ["bind", St], ["bindKey", xr], ["curry", Ut], ["curryRight", Br], ["flip", ba], ["partial", Bt], ["partialRight", Fr], ["rearg", jr]], Sr = "[object Arguments]", An = "[object Array]", Pc = "[object AsyncFunction]", $r = "[object Boolean]", qr = "[object Date]", Tc = "[object DOMException]", _n = "[object Error]", Cn = "[object Function]", no = "[object GeneratorFunction]", It = "[object Map]", Wr = "[object Number]", Ec = "[object Null]", jt = "[object Object]", ao = "[object Promise]", Nc = "[object Proxy]", Gr = "[object RegExp]", kt = "[object Set]", Xr = "[object String]", xn = "[object Symbol]", Hc = "[object Undefined]", Vr = "[object WeakMap]", Mc = "[object WeakSet]", Kr = "[object ArrayBuffer]", Ir = "[object DataView]", wa = "[object Float32Array]", Aa = "[object Float64Array]", _a = "[object Int8Array]", Ca = "[object Int16Array]", xa = "[object Int32Array]", Sa = "[object Uint8Array]", Ia = "[object Uint8ClampedArray]", ka = "[object Uint16Array]", Pa = "[object Uint32Array]", Dc = /\b__p\+='';/g, Rc = /\b(__p\+=)''\+/g, zc = /(__e\(.*?\)|\b__t\))\+'';/g, so = /&(?:amp|lt|gt|quot|#39);/g, oo = /[&<>"']/g, Lc = RegExp(so.source), Oc = RegExp(oo.source), Uc = /<%-([\s\S]+?)%>/g, Bc = /<%([\s\S]+?)%>/g, io = /<%=([\s\S]+?)%>/g, Fc = /\.|\[(?:[^[\]]*|(["'])(?:(?!\1)[^\\]|\\.)*?\1)\]/, jc = /^\w*$/, $c = /[^.[\]]+|\[(?:(-?\d+(?:\.\d+)?)|(["'])((?:(?!\2)[^\\]|\\.)*?)\2)\]|(?=(?:\.|\[\])(?:\.|\[\]|$))/g, Ta = /[\\^$.*+?()[\]{}|]/g, qc = RegExp(Ta.source), Ea = /^\s+/, Wc = /\s/, Gc = /\{(?:\n\/\* \[wrapped with .+\] \*\/)?\n?/, Xc = /\{\n\/\* \[wrapped with (.+)\] \*/, Vc = /,? & /, Kc = /[^\x00-\x2f\x3a-\x40\x5b-\x60\x7b-\x7f]+/g, lo = /[()=,{}\[\]\/\s]/, Jc = /\\(\\)?/g, Zc = /\$\{([^\\}]*(?:\\.[^\\}]*)*)\}/g, co = /\w*$/, Yc = /^[-+]0x[0-9a-f]+$/i, Qc = /^0b[01]+$/i, eu = /^\[object .+?Constructor\]$/, tu = /^0o[0-7]+$/i, ru = /^(?:0|[1-9]\d*)$/, nu = /[\xc0-\xd6\xd8-\xf6\xf8-\xff\u0100-\u017f]/g, Sn = /($^)/, au = /['\n\r\u2028\u2029\\]/g, In = "\\ud800-\\udfff", su = "\\u0300-\\u036f", ou = "\\ufe20-\\ufe2f", iu = "\\u20d0-\\u20ff", uo = su + ou + iu, ho = "\\u2700-\\u27bf", po = "a-z\\xdf-\\xf6\\xf8-\\xff", lu = "\\xac\\xb1\\xd7\\xf7", cu = "\\x00-\\x2f\\x3a-\\x40\\x5b-\\x60\\x7b-\\xbf", uu = "\\u2000-\\u206f", du = " \\t\\x0b\\f\\xa0\\ufeff\\n\\r\\u2028\\u2029\\u1680\\u180e\\u2000\\u2001\\u2002\\u2003\\u2004\\u2005\\u2006\\u2007\\u2008\\u2009\\u200a\\u202f\\u205f\\u3000", fo = "A-Z\\xc0-\\xd6\\xd8-\\xde", mo = "\\ufe0e\\ufe0f", go = lu + cu + uu + du, Na = "['’]", hu = "[" + In + "]", vo = "[" + go + "]", kn = "[" + uo + "]", yo = "\\d+", pu = "[" + ho + "]", bo = "[" + po + "]", wo = "[^" + In + go + yo + ho + po + fo + "]", Ha = "\\ud83c[\\udffb-\\udfff]", fu = "(?:" + kn + "|" + Ha + ")", Ao = "[^" + In + "]", Ma = "(?:\\ud83c[\\udde6-\\uddff]){2}", Da = "[\\ud800-\\udbff][\\udc00-\\udfff]", kr = "[" + fo + "]", _o = "\\u200d", Co = "(?:" + bo + "|" + wo + ")", mu = "(?:" + kr + "|" + wo + ")", xo = "(?:" + Na + "(?:d|ll|m|re|s|t|ve))?", So = "(?:" + Na + "(?:D|LL|M|RE|S|T|VE))?", Io = fu + "?", ko = "[" + mo + "]?", gu = "(?:" + _o + "(?:" + [Ao, Ma, Da].join("|") + ")" + ko + Io + ")*", vu = "\\d*(?:1st|2nd|3rd|(?![123])\\dth)(?=\\b|[A-Z_])", yu = "\\d*(?:1ST|2ND|3RD|(?![123])\\dTH)(?=\\b|[a-z_])", Po = ko + Io + gu, bu = "(?:" + [pu, Ma, Da].join("|") + ")" + Po, wu = "(?:" + [Ao + kn + "?", kn, Ma, Da, hu].join("|") + ")", Au = RegExp(Na, "g"), _u = RegExp(kn, "g"), Ra = RegExp(Ha + "(?=" + Ha + ")|" + wu + Po, "g"), Cu = RegExp([kr + "?" + bo + "+" + xo + "(?=" + [vo, kr, "$"].join("|") + ")", mu + "+" + So + "(?=" + [vo, kr + Co, "$"].join("|") + ")", kr + "?" + Co + "+" + xo, kr + "+" + So, yu, vu, yo, bu].join("|"), "g"), xu = RegExp("[" + _o + In + uo + mo + "]"), Su = /[a-z][A-Z]|[A-Z]{2}[a-z]|[0-9][a-zA-Z]|[a-zA-Z][0-9]|[^a-zA-Z0-9 ]/, Iu = ["Array", "Buffer", "DataView", "Date", "Error", "Float32Array", "Float64Array", "Function", "Int8Array", "Int16Array", "Int32Array", "Map", "Math", "Object", "Promise", "RegExp", "Set", "String", "Symbol", "TypeError", "Uint8Array", "Uint8ClampedArray", "Uint16Array", "Uint32Array", "WeakMap", "_", "clearTimeout", "isFinite", "parseInt", "setTimeout"], Me = {};
      Me[wa] = Me[Aa] = Me[_a] = Me[Ca] = Me[xa] = Me[Sa] = Me[Ia] = Me[ka] = Me[Pa] = !0, Me[Sr] = Me[An] = Me[Kr] = Me[$r] = Me[Ir] = Me[qr] = Me[_n] = Me[Cn] = Me[It] = Me[Wr] = Me[jt] = Me[Gr] = Me[kt] = Me[Xr] = Me[Vr] = !1;
      var He = {};
      He[Sr] = He[An] = He[Kr] = He[Ir] = He[$r] = He[qr] = He[wa] = He[Aa] = He[_a] = He[Ca] = He[xa] = He[It] = He[Wr] = He[jt] = He[Gr] = He[kt] = He[Xr] = He[xn] = He[Sa] = He[Ia] = He[ka] = He[Pa] = !0, He[_n] = He[Cn] = He[Vr] = !1;
      var ku = {
        À: "A",
        Á: "A",
        Â: "A",
        Ã: "A",
        Ä: "A",
        Å: "A",
        à: "a",
        á: "a",
        â: "a",
        ã: "a",
        ä: "a",
        å: "a",
        Ç: "C",
        ç: "c",
        Ð: "D",
        ð: "d",
        È: "E",
        É: "E",
        Ê: "E",
        Ë: "E",
        è: "e",
        é: "e",
        ê: "e",
        ë: "e",
        Ì: "I",
        Í: "I",
        Î: "I",
        Ï: "I",
        ì: "i",
        í: "i",
        î: "i",
        ï: "i",
        Ñ: "N",
        ñ: "n",
        Ò: "O",
        Ó: "O",
        Ô: "O",
        Õ: "O",
        Ö: "O",
        Ø: "O",
        ò: "o",
        ó: "o",
        ô: "o",
        õ: "o",
        ö: "o",
        ø: "o",
        Ù: "U",
        Ú: "U",
        Û: "U",
        Ü: "U",
        ù: "u",
        ú: "u",
        û: "u",
        ü: "u",
        Ý: "Y",
        ý: "y",
        ÿ: "y",
        Æ: "Ae",
        æ: "ae",
        Þ: "Th",
        þ: "th",
        ß: "ss",
        Ā: "A",
        Ă: "A",
        Ą: "A",
        ā: "a",
        ă: "a",
        ą: "a",
        Ć: "C",
        Ĉ: "C",
        Ċ: "C",
        Č: "C",
        ć: "c",
        ĉ: "c",
        ċ: "c",
        č: "c",
        Ď: "D",
        Đ: "D",
        ď: "d",
        đ: "d",
        Ē: "E",
        Ĕ: "E",
        Ė: "E",
        Ę: "E",
        Ě: "E",
        ē: "e",
        ĕ: "e",
        ė: "e",
        ę: "e",
        ě: "e",
        Ĝ: "G",
        Ğ: "G",
        Ġ: "G",
        Ģ: "G",
        ĝ: "g",
        ğ: "g",
        ġ: "g",
        ģ: "g",
        Ĥ: "H",
        Ħ: "H",
        ĥ: "h",
        ħ: "h",
        Ĩ: "I",
        Ī: "I",
        Ĭ: "I",
        Į: "I",
        İ: "I",
        ĩ: "i",
        ī: "i",
        ĭ: "i",
        į: "i",
        ı: "i",
        Ĵ: "J",
        ĵ: "j",
        Ķ: "K",
        ķ: "k",
        ĸ: "k",
        Ĺ: "L",
        Ļ: "L",
        Ľ: "L",
        Ŀ: "L",
        Ł: "L",
        ĺ: "l",
        ļ: "l",
        ľ: "l",
        ŀ: "l",
        ł: "l",
        Ń: "N",
        Ņ: "N",
        Ň: "N",
        Ŋ: "N",
        ń: "n",
        ņ: "n",
        ň: "n",
        ŋ: "n",
        Ō: "O",
        Ŏ: "O",
        Ő: "O",
        ō: "o",
        ŏ: "o",
        ő: "o",
        Ŕ: "R",
        Ŗ: "R",
        Ř: "R",
        ŕ: "r",
        ŗ: "r",
        ř: "r",
        Ś: "S",
        Ŝ: "S",
        Ş: "S",
        Š: "S",
        ś: "s",
        ŝ: "s",
        ş: "s",
        š: "s",
        Ţ: "T",
        Ť: "T",
        Ŧ: "T",
        ţ: "t",
        ť: "t",
        ŧ: "t",
        Ũ: "U",
        Ū: "U",
        Ŭ: "U",
        Ů: "U",
        Ű: "U",
        Ų: "U",
        ũ: "u",
        ū: "u",
        ŭ: "u",
        ů: "u",
        ű: "u",
        ų: "u",
        Ŵ: "W",
        ŵ: "w",
        Ŷ: "Y",
        ŷ: "y",
        Ÿ: "Y",
        Ź: "Z",
        Ż: "Z",
        Ž: "Z",
        ź: "z",
        ż: "z",
        ž: "z",
        Ĳ: "IJ",
        ĳ: "ij",
        Œ: "Oe",
        œ: "oe",
        ŉ: "'n",
        ſ: "s"
      }, Pu = { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }, Tu = { "&amp;": "&", "&lt;": "<", "&gt;": ">", "&quot;": '"', "&#39;": "'" }, Eu = { "\\": "\\", "'": "'", "\n": "n", "\r": "r", "\u2028": "u2028", "\u2029": "u2029" }, Nu = parseFloat, Hu = parseInt, To = typeof ua == "object" && ua && ua.Object === Object && ua, Mu = typeof self == "object" && self && self.Object === Object && self, Ge = To || Mu || Function("return this")(), za = l && !l.nodeType && l, cr = za && !0 && s && !s.nodeType && s, Eo = cr && cr.exports === za, La = Eo && To.process, mt = (function() {
        try {
          var y = cr && cr.require && cr.require("util").types;
          return y || La && La.binding && La.binding("util");
        } catch {
        }
      })(), No = mt && mt.isArrayBuffer, Ho = mt && mt.isDate, Mo = mt && mt.isMap, Do = mt && mt.isRegExp, Ro = mt && mt.isSet, zo = mt && mt.isTypedArray, Du = te("length"), Ru = de(ku), zu = de(Pu), Lu = de(Tu), Ou = function y(k) {
        function a(e) {
          if (Oe(e) && !fe(e) && !(e instanceof K)) {
            if (e instanceof oe) return e;
            if (Pe.call(e, "__wrapped__")) return Ei(e);
          }
          return new oe(e);
        }
        function V() {
        }
        function oe(e, t) {
          this.__wrapped__ = e, this.__actions__ = [], this.__chain__ = !!t, this.__index__ = 0, this.__values__ = c;
        }
        function K(e) {
          this.__wrapped__ = e, this.__actions__ = [], this.__dir__ = 1, this.__filtered__ = !1, this.__iteratees__ = [], this.__takeCount__ = Dt, this.__views__ = [];
        }
        function st() {
          var e = new K(this.__wrapped__);
          return e.__actions__ = ot(this.__actions__), e.__dir__ = this.__dir__, e.__filtered__ = this.__filtered__, e.__iteratees__ = ot(this.__iteratees__), e.__takeCount__ = this.__takeCount__, e.__views__ = ot(this.__views__), e;
        }
        function Oa() {
          if (this.__filtered__) {
            var e = new K(this);
            e.__dir__ = -1, e.__filtered__ = !0;
          } else e = this.clone(), e.__dir__ *= -1;
          return e;
        }
        function Uu() {
          var e = this.__wrapped__.value(), t = this.__dir__, r = fe(e), n = t < 0, i = r ? e.length : 0, u = Vd(0, i, this.__views__), m = u.start, g = u.end, A = g - m, E = n ? g : m - 1, P = this.__iteratees__, D = P.length, W = 0, Y = Ye(A, this.__takeCount__);
          if (!r || !n && i == A && Y == A) return ni(e, this.__actions__);
          var re = [];
          e: for (; A-- && W < Y; ) {
            E += t;
            for (var me = -1, ee = e[E]; ++me < D; ) {
              var be = P[me], we = be.iteratee, et = be.type, ut = we(ee);
              if (et == _c) ee = ut;
              else if (!ut) {
                if (et == ro) continue e;
                break e;
              }
            }
            re[W++] = ee;
          }
          return re;
        }
        function ur(e) {
          var t = -1, r = e == null ? 0 : e.length;
          for (this.clear(); ++t < r; ) {
            var n = e[t];
            this.set(n[0], n[1]);
          }
        }
        function Bu() {
          this.__data__ = ln ? ln(null) : {}, this.size = 0;
        }
        function Fu(e) {
          var t = this.has(e) && delete this.__data__[e];
          return this.size -= t ? 1 : 0, t;
        }
        function ju(e) {
          var t = this.__data__;
          if (ln) {
            var r = t[e];
            return r === Yt ? c : r;
          }
          return Pe.call(t, e) ? t[e] : c;
        }
        function $u(e) {
          var t = this.__data__;
          return ln ? t[e] !== c : Pe.call(t, e);
        }
        function qu(e, t) {
          var r = this.__data__;
          return this.size += this.has(e) ? 0 : 1, r[e] = ln && t === c ? Yt : t, this;
        }
        function $t(e) {
          var t = -1, r = e == null ? 0 : e.length;
          for (this.clear(); ++t < r; ) {
            var n = e[t];
            this.set(n[0], n[1]);
          }
        }
        function Wu() {
          this.__data__ = [], this.size = 0;
        }
        function Gu(e) {
          var t = this.__data__, r = Pn(t, e);
          return !(r < 0) && (r == t.length - 1 ? t.pop() : na.call(t, r, 1), --this.size, !0);
        }
        function Xu(e) {
          var t = this.__data__, r = Pn(t, e);
          return r < 0 ? c : t[r][1];
        }
        function Vu(e) {
          return Pn(this.__data__, e) > -1;
        }
        function Ku(e, t) {
          var r = this.__data__, n = Pn(r, e);
          return n < 0 ? (++this.size, r.push([e, t])) : r[n][1] = t, this;
        }
        function qt(e) {
          var t = -1, r = e == null ? 0 : e.length;
          for (this.clear(); ++t < r; ) {
            var n = e[t];
            this.set(n[0], n[1]);
          }
        }
        function Ju() {
          this.size = 0, this.__data__ = { hash: new ur(), map: new (sn || $t)(), string: new ur() };
        }
        function Zu(e) {
          var t = Bn(this, e).delete(e);
          return this.size -= t ? 1 : 0, t;
        }
        function Yu(e) {
          return Bn(this, e).get(e);
        }
        function Qu(e) {
          return Bn(this, e).has(e);
        }
        function ed(e, t) {
          var r = Bn(this, e), n = r.size;
          return r.set(e, t), this.size += r.size == n ? 0 : 1, this;
        }
        function dr(e) {
          var t = -1, r = e == null ? 0 : e.length;
          for (this.__data__ = new qt(); ++t < r; ) this.add(e[t]);
        }
        function td(e) {
          return this.__data__.set(e, Yt), this;
        }
        function rd(e) {
          return this.__data__.has(e);
        }
        function Pt(e) {
          this.size = (this.__data__ = new $t(e)).size;
        }
        function nd() {
          this.__data__ = new $t(), this.size = 0;
        }
        function ad(e) {
          var t = this.__data__, r = t.delete(e);
          return this.size = t.size, r;
        }
        function sd(e) {
          return this.__data__.get(e);
        }
        function od(e) {
          return this.__data__.has(e);
        }
        function id(e, t) {
          var r = this.__data__;
          if (r instanceof $t) {
            var n = r.__data__;
            if (!sn || n.length < ce - 1) return n.push([e, t]), this.size = ++r.size, this;
            r = this.__data__ = new qt(n);
          }
          return r.set(e, t), this.size = r.size, this;
        }
        function Lo(e, t) {
          var r = fe(e), n = !r && vr(e), i = !r && !n && or(e), u = !r && !n && !i && Or(e), m = r || n || i || u, g = m ? $(e.length, am) : [], A = g.length;
          for (var E in e) !t && !Pe.call(e, E) || m && (E == "length" || i && (E == "offset" || E == "parent") || u && (E == "buffer" || E == "byteLength" || E == "byteOffset") || Xt(E, A)) || g.push(E);
          return g;
        }
        function Oo(e) {
          var t = e.length;
          return t ? e[Va(0, t - 1)] : c;
        }
        function ld(e, t) {
          return Fn(ot(e), hr(t, 0, e.length));
        }
        function cd(e) {
          return Fn(ot(e));
        }
        function Ua(e, t, r) {
          (r === c || Et(e[t], r)) && (r !== c || t in e) || Rt(e, t, r);
        }
        function Jr(e, t, r) {
          var n = e[t];
          Pe.call(e, t) && Et(n, r) && (r !== c || t in e) || Rt(e, t, r);
        }
        function Pn(e, t) {
          for (var r = e.length; r--; ) if (Et(e[r][0], t)) return r;
          return -1;
        }
        function ud(e, t, r, n) {
          return sr(e, function(i, u, m) {
            t(n, i, r(i), m);
          }), n;
        }
        function Uo(e, t) {
          return e && Lt(t, We(t), e);
        }
        function dd(e, t) {
          return e && Lt(t, lt(t), e);
        }
        function Rt(e, t, r) {
          t == "__proto__" && aa ? aa(e, t, { configurable: !0, enumerable: !0, value: r, writable: !0 }) : e[t] = r;
        }
        function Ba(e, t) {
          for (var r = -1, n = t.length, i = je(n), u = e == null; ++r < n; ) i[r] = u ? c : ps(e, t[r]);
          return i;
        }
        function hr(e, t, r) {
          return e === e && (r !== c && (e = e <= r ? e : r), t !== c && (e = e >= t ? e : t)), e;
        }
        function gt(e, t, r, n, i, u) {
          var m, g = t & Qt, A = t & eo, E = t & _r;
          if (r && (m = i ? r(e, n, i, u) : r(e)), m !== c) return m;
          if (!ze(e)) return e;
          var P = fe(e);
          if (P) {
            if (m = Jd(e), !g) return ot(e, m);
          } else {
            var D = Qe(e), W = D == Cn || D == no;
            if (or(e)) return si(e, g);
            if (D == jt || D == Sr || W && !i) {
              if (m = A || W ? {} : Ci(e), !g) return A ? Bd(e, dd(m, e)) : Ud(e, Uo(m, e));
            } else {
              if (!He[D]) return i ? e : {};
              m = Zd(e, D, g);
            }
          }
          u || (u = new Pt());
          var Y = u.get(e);
          if (Y) return Y;
          u.set(e, m), wl(e) ? e.forEach(function(ee) {
            m.add(gt(ee, t, r, ee, e, u));
          }) : bl(e) && e.forEach(function(ee, be) {
            m.set(be, gt(ee, t, r, be, e, u));
          });
          var re = E ? A ? ss : as : A ? lt : We, me = P ? c : re(e);
          return h(me || e, function(ee, be) {
            me && (be = ee, ee = e[be]), Jr(m, be, gt(ee, t, r, be, e, u));
          }), m;
        }
        function hd(e) {
          var t = We(e);
          return function(r) {
            return Bo(r, e, t);
          };
        }
        function Bo(e, t, r) {
          var n = r.length;
          if (e == null) return !n;
          for (e = De(e); n--; ) {
            var i = r[n], u = t[i], m = e[i];
            if (m === c && !(i in e) || !u(m)) return !1;
          }
          return !0;
        }
        function Fo(e, t, r) {
          if (typeof e != "function") throw new wt(Q);
          return un(function() {
            e.apply(c, r);
          }, t);
        }
        function Zr(e, t, r, n) {
          var i = -1, u = S, m = !0, g = e.length, A = [], E = t.length;
          if (!g) return A;
          r && (t = b(t, ye(r))), n ? (u = N, m = !1) : t.length >= ce && (u = Ce, m = !1, t = new dr(t));
          e: for (; ++i < g; ) {
            var P = e[i], D = r == null ? P : r(P);
            if (P = n || P !== 0 ? P : 0, m && D === D) {
              for (var W = E; W--; ) if (t[W] === D) continue e;
              A.push(P);
            } else u(t, D, n) || A.push(P);
          }
          return A;
        }
        function pd(e, t) {
          var r = !0;
          return sr(e, function(n, i, u) {
            return r = !!t(n, i, u);
          }), r;
        }
        function Tn(e, t, r) {
          for (var n = -1, i = e.length; ++n < i; ) {
            var u = e[n], m = t(u);
            if (m != null && (g === c ? m === m && !pt(m) : r(m, g))) var g = m, A = u;
          }
          return A;
        }
        function fd(e, t, r, n) {
          var i = e.length;
          for (r = ge(r), r < 0 && (r = -r > i ? 0 : i + r), n = n === c || n > i ? i : ge(n), n < 0 && (n += i), n = r > n ? 0 : Vi(n); r < n; ) e[r++] = t;
          return e;
        }
        function jo(e, t) {
          var r = [];
          return sr(e, function(n, i, u) {
            t(n, i, u) && r.push(n);
          }), r;
        }
        function Xe(e, t, r, n, i) {
          var u = -1, m = e.length;
          for (r || (r = Qd), i || (i = []); ++u < m; ) {
            var g = e[u];
            t > 0 && r(g) ? t > 1 ? Xe(g, t - 1, r, n, i) : C(i, g) : n || (i[i.length] = g);
          }
          return i;
        }
        function zt(e, t) {
          return e && Ss(e, t, We);
        }
        function Fa(e, t) {
          return e && dl(e, t, We);
        }
        function En(e, t) {
          return w(t, function(r) {
            return Vt(e[r]);
          });
        }
        function pr(e, t) {
          t = rr(t, e);
          for (var r = 0, n = t.length; e != null && r < n; ) e = e[Tt(t[r++])];
          return r && r == n ? e : c;
        }
        function $o(e, t, r) {
          var n = t(e);
          return fe(e) ? n : C(n, r(e));
        }
        function nt(e) {
          return e == null ? e === c ? Hc : Ec : gr && gr in De(e) ? Xd(e) : sh(e);
        }
        function ja(e, t) {
          return e > t;
        }
        function md(e, t) {
          return e != null && Pe.call(e, t);
        }
        function gd(e, t) {
          return e != null && t in De(e);
        }
        function vd(e, t, r) {
          return e >= Ye(t, r) && e < $e(t, r);
        }
        function $a(e, t, r) {
          for (var n = r ? N : S, i = e[0].length, u = e.length, m = u, g = je(u), A = 1 / 0, E = []; m--; ) {
            var P = e[m];
            m && t && (P = b(P, ye(t))), A = Ye(P.length, A), g[m] = !r && (t || i >= 120 && P.length >= 120) ? new dr(m && P) : c;
          }
          P = e[0];
          var D = -1, W = g[0];
          e: for (; ++D < i && E.length < A; ) {
            var Y = P[D], re = t ? t(Y) : Y;
            if (Y = r || Y !== 0 ? Y : 0, !(W ? Ce(W, re) : n(E, re, r))) {
              for (m = u; --m; ) {
                var me = g[m];
                if (!(me ? Ce(me, re) : n(e[m], re, r))) continue e;
              }
              W && W.push(re), E.push(Y);
            }
          }
          return E;
        }
        function yd(e, t, r, n) {
          return zt(e, function(i, u, m) {
            t(n, r(i), u, m);
          }), n;
        }
        function Yr(e, t, r) {
          t = rr(t, e), e = ki(e, t);
          var n = e == null ? e : e[Tt(yt(t))];
          return n == null ? c : d(n, e, r);
        }
        function qo(e) {
          return Oe(e) && nt(e) == Sr;
        }
        function bd(e) {
          return Oe(e) && nt(e) == Kr;
        }
        function wd(e) {
          return Oe(e) && nt(e) == qr;
        }
        function Qr(e, t, r, n, i) {
          return e === t || (e == null || t == null || !Oe(e) && !Oe(t) ? e !== e && t !== t : Ad(e, t, r, n, Qr, i));
        }
        function Ad(e, t, r, n, i, u) {
          var m = fe(e), g = fe(t), A = m ? An : Qe(e), E = g ? An : Qe(t);
          A = A == Sr ? jt : A, E = E == Sr ? jt : E;
          var P = A == jt, D = E == jt, W = A == E;
          if (W && or(e)) {
            if (!or(t)) return !1;
            m = !0, P = !1;
          }
          if (W && !P) return u || (u = new Pt()), m || Or(e) ? Ai(e, t, r, n, i, u) : Wd(e, t, A, r, n, i, u);
          if (!(r & Cr)) {
            var Y = P && Pe.call(e, "__wrapped__"), re = D && Pe.call(t, "__wrapped__");
            if (Y || re) {
              var me = Y ? e.value() : e, ee = re ? t.value() : t;
              return u || (u = new Pt()), i(me, ee, r, n, u);
            }
          }
          return !!W && (u || (u = new Pt()), Gd(e, t, r, n, i, u));
        }
        function _d(e) {
          return Oe(e) && Qe(e) == It;
        }
        function qa(e, t, r, n) {
          var i = r.length, u = i, m = !n;
          if (e == null) return !u;
          for (e = De(e); i--; ) {
            var g = r[i];
            if (m && g[2] ? g[1] !== e[g[0]] : !(g[0] in e)) return !1;
          }
          for (; ++i < u; ) {
            g = r[i];
            var A = g[0], E = e[A], P = g[1];
            if (m && g[2]) {
              if (E === c && !(A in e)) return !1;
            } else {
              var D = new Pt();
              if (n) var W = n(E, P, A, e, t, D);
              if (!(W === c ? Qr(P, E, Cr | bn, n, D) : W)) return !1;
            }
          }
          return !0;
        }
        function Wo(e) {
          return !(!ze(e) || th(e)) && (Vt(e) ? cm : eu).test(mr(e));
        }
        function Cd(e) {
          return Oe(e) && nt(e) == Gr;
        }
        function xd(e) {
          return Oe(e) && Qe(e) == kt;
        }
        function Sd(e) {
          return Oe(e) && Gn(e.length) && !!Me[nt(e)];
        }
        function Go(e) {
          return typeof e == "function" ? e : e == null ? ct : typeof e == "object" ? fe(e) ? Ko(e[0], e[1]) : Vo(e) : el(e);
        }
        function Wa(e) {
          if (!rn(e)) return mm(e);
          var t = [];
          for (var r in De(e)) Pe.call(e, r) && r != "constructor" && t.push(r);
          return t;
        }
        function Id(e) {
          if (!ze(e)) return ah(e);
          var t = rn(e), r = [];
          for (var n in e) (n != "constructor" || !t && Pe.call(e, n)) && r.push(n);
          return r;
        }
        function Ga(e, t) {
          return e < t;
        }
        function Xo(e, t) {
          var r = -1, n = it(e) ? je(e.length) : [];
          return sr(e, function(i, u, m) {
            n[++r] = t(i, u, m);
          }), n;
        }
        function Vo(e) {
          var t = os(e);
          return t.length == 1 && t[0][2] ? Si(t[0][0], t[0][1]) : function(r) {
            return r === e || qa(r, e, t);
          };
        }
        function Ko(e, t) {
          return is(e) && xi(t) ? Si(Tt(e), t) : function(r) {
            var n = ps(r, e);
            return n === c && n === t ? fs(r, e) : Qr(t, n, Cr | bn);
          };
        }
        function Nn(e, t, r, n, i) {
          e !== t && Ss(t, function(u, m) {
            if (i || (i = new Pt()), ze(u)) kd(e, t, m, r, Nn, n, i);
            else {
              var g = n ? n(cs(e, m), u, m + "", e, t, i) : c;
              g === c && (g = u), Ua(e, m, g);
            }
          }, lt);
        }
        function kd(e, t, r, n, i, u, m) {
          var g = cs(e, r), A = cs(t, r), E = m.get(A);
          if (E) return Ua(e, r, E), c;
          var P = u ? u(g, A, r + "", e, t, m) : c, D = P === c;
          if (D) {
            var W = fe(A), Y = !W && or(A), re = !W && !Y && Or(A);
            P = A, W || Y || re ? fe(g) ? P = g : Be(g) ? P = ot(g) : Y ? (D = !1, P = si(A, !0)) : re ? (D = !1, P = oi(A, !0)) : P = [] : nn(A) || vr(A) ? (P = g, vr(g) ? P = Ki(g) : ze(g) && !Vt(g) || (P = Ci(A))) : D = !1;
          }
          D && (m.set(A, P), i(P, A, n, u, m), m.delete(A)), Ua(e, r, P);
        }
        function Jo(e, t) {
          var r = e.length;
          if (r) return t += t < 0 ? r : 0, Xt(t, r) ? e[t] : c;
        }
        function Zo(e, t, r) {
          t = t.length ? b(t, function(i) {
            return fe(i) ? function(u) {
              return pr(u, i.length === 1 ? i[0] : i);
            } : i;
          }) : [ct];
          var n = -1;
          return t = b(t, ye(ue())), B(Xo(e, function(i, u, m) {
            return { a: b(t, function(g) {
              return g(i);
            }), b: ++n, c: i };
          }), function(i, u) {
            return Od(i, u, r);
          });
        }
        function Pd(e, t) {
          return Yo(e, t, function(r, n) {
            return fs(e, n);
          });
        }
        function Yo(e, t, r) {
          for (var n = -1, i = t.length, u = {}; ++n < i; ) {
            var m = t[n], g = pr(e, m);
            r(g, m) && en(u, rr(m, e), g);
          }
          return u;
        }
        function Td(e) {
          return function(t) {
            return pr(t, e);
          };
        }
        function Xa(e, t, r, n) {
          var i = n ? J : F, u = -1, m = t.length, g = e;
          for (e === t && (t = ot(t)), r && (g = b(e, ye(r))); ++u < m; ) for (var A = 0, E = t[u], P = r ? r(E) : E; (A = i(g, P, A, n)) > -1; ) g !== e && na.call(g, A, 1), na.call(e, A, 1);
          return e;
        }
        function Qo(e, t) {
          for (var r = e ? t.length : 0, n = r - 1; r--; ) {
            var i = t[r];
            if (r == n || i !== u) {
              var u = i;
              Xt(i) ? na.call(e, i, 1) : Za(e, i);
            }
          }
          return e;
        }
        function Va(e, t) {
          return e + oa(ll() * (t - e + 1));
        }
        function Ed(e, t, r, n) {
          for (var i = -1, u = $e(sa((t - e) / (r || 1)), 0), m = je(u); u--; ) m[n ? u : ++i] = e, e += r;
          return m;
        }
        function Ka(e, t) {
          var r = "";
          if (!e || t < 1 || t > er) return r;
          do
            t % 2 && (r += e), t = oa(t / 2), t && (e += e);
          while (t);
          return r;
        }
        function ve(e, t) {
          return Ps(Ii(e, t, ct), e + "");
        }
        function Nd(e) {
          return Oo(Hr(e));
        }
        function Hd(e, t) {
          var r = Hr(e);
          return Fn(r, hr(t, 0, r.length));
        }
        function en(e, t, r, n) {
          if (!ze(e)) return e;
          t = rr(t, e);
          for (var i = -1, u = t.length, m = u - 1, g = e; g != null && ++i < u; ) {
            var A = Tt(t[i]), E = r;
            if (A === "__proto__" || A === "constructor" || A === "prototype") return e;
            if (i != m) {
              var P = g[A];
              E = n ? n(P, A, g) : c, E === c && (E = ze(P) ? P : Xt(t[i + 1]) ? [] : {});
            }
            Jr(g, A, E), g = g[A];
          }
          return e;
        }
        function Md(e) {
          return Fn(Hr(e));
        }
        function vt(e, t, r) {
          var n = -1, i = e.length;
          t < 0 && (t = -t > i ? 0 : i + t), r = r > i ? i : r, r < 0 && (r += i), i = t > r ? 0 : r - t >>> 0, t >>>= 0;
          for (var u = je(i); ++n < i; ) u[n] = e[n + t];
          return u;
        }
        function Dd(e, t) {
          var r;
          return sr(e, function(n, i, u) {
            return r = t(n, i, u), !r;
          }), !!r;
        }
        function Hn(e, t, r) {
          var n = 0, i = e == null ? n : e.length;
          if (typeof t == "number" && t === t && i <= Ic) {
            for (; n < i; ) {
              var u = n + i >>> 1, m = e[u];
              m !== null && !pt(m) && (r ? m <= t : m < t) ? n = u + 1 : i = u;
            }
            return i;
          }
          return Ja(e, t, ct, r);
        }
        function Ja(e, t, r, n) {
          var i = 0, u = e == null ? 0 : e.length;
          if (u === 0) return 0;
          t = r(t);
          for (var m = t !== t, g = t === null, A = pt(t), E = t === c; i < u; ) {
            var P = oa((i + u) / 2), D = r(e[P]), W = D !== c, Y = D === null, re = D === D, me = pt(D);
            if (m) var ee = n || re;
            else ee = E ? re && (n || W) : g ? re && W && (n || !Y) : A ? re && W && !Y && (n || !me) : !Y && !me && (n ? D <= t : D < t);
            ee ? i = P + 1 : u = P;
          }
          return Ye(u, Sc);
        }
        function ei(e, t) {
          for (var r = -1, n = e.length, i = 0, u = []; ++r < n; ) {
            var m = e[r], g = t ? t(m) : m;
            if (!r || !Et(g, A)) {
              var A = g;
              u[i++] = m === 0 ? 0 : m;
            }
          }
          return u;
        }
        function ti(e) {
          return typeof e == "number" ? e : pt(e) ? wn : +e;
        }
        function ht(e) {
          if (typeof e == "string") return e;
          if (fe(e)) return b(e, ht) + "";
          if (pt(e)) return cl ? cl.call(e) : "";
          var t = e + "";
          return t == "0" && 1 / e == -lr ? "-0" : t;
        }
        function tr(e, t, r) {
          var n = -1, i = S, u = e.length, m = !0, g = [], A = g;
          if (r) m = !1, i = N;
          else if (u >= ce) {
            var E = t ? null : Im(e);
            if (E) return rt(E);
            m = !1, i = Ce, A = new dr();
          } else A = t ? [] : g;
          e: for (; ++n < u; ) {
            var P = e[n], D = t ? t(P) : P;
            if (P = r || P !== 0 ? P : 0, m && D === D) {
              for (var W = A.length; W--; ) if (A[W] === D) continue e;
              t && A.push(D), g.push(P);
            } else i(A, D, r) || (A !== g && A.push(D), g.push(P));
          }
          return g;
        }
        function Za(e, t) {
          t = rr(t, e);
          var r = -1, n = t.length;
          if (!n) return !0;
          for (; ++r < n; ) {
            var i = Tt(t[r]);
            if (i === "__proto__" && !Pe.call(e, "__proto__") || (i === "constructor" || i === "prototype") && r < n - 1) return !1;
          }
          var u = ki(e, t);
          return u == null || delete u[Tt(yt(t))];
        }
        function ri(e, t, r, n) {
          return en(e, t, r(pr(e, t)), n);
        }
        function Mn(e, t, r, n) {
          for (var i = e.length, u = n ? i : -1; (n ? u-- : ++u < i) && t(e[u], u, e); ) ;
          return r ? vt(e, n ? 0 : u, n ? u + 1 : i) : vt(e, n ? u + 1 : 0, n ? i : u);
        }
        function ni(e, t) {
          var r = e;
          return r instanceof K && (r = r.value()), T(t, function(n, i) {
            return i.func.apply(i.thisArg, C([n], i.args));
          }, r);
        }
        function Ya(e, t, r) {
          var n = e.length;
          if (n < 2) return n ? tr(e[0]) : [];
          for (var i = -1, u = je(n); ++i < n; ) for (var m = e[i], g = -1; ++g < n; ) g != i && (u[i] = Zr(u[i] || m, e[g], t, r));
          return tr(Xe(u, 1), t, r);
        }
        function ai(e, t, r) {
          for (var n = -1, i = e.length, u = t.length, m = {}; ++n < i; )
            r(m, e[n], n < u ? t[n] : c);
          return m;
        }
        function Qa(e) {
          return Be(e) ? e : [];
        }
        function es(e) {
          return typeof e == "function" ? e : ct;
        }
        function rr(e, t) {
          return fe(e) ? e : is(e, t) ? [e] : gl(ke(e));
        }
        function nr(e, t, r) {
          var n = e.length;
          return r = r === c ? n : r, !t && r >= n ? e : vt(e, t, r);
        }
        function si(e, t) {
          if (t) return e.slice();
          var r = e.length, n = nl ? nl(r) : new e.constructor(r);
          return e.copy(n), n;
        }
        function ts(e) {
          var t = new e.constructor(e.byteLength);
          return new ta(t).set(new ta(e)), t;
        }
        function Rd(e, t) {
          return new e.constructor(t ? ts(e.buffer) : e.buffer, e.byteOffset, e.byteLength);
        }
        function zd(e) {
          var t = new e.constructor(e.source, co.exec(e));
          return t.lastIndex = e.lastIndex, t;
        }
        function Ld(e) {
          return cn ? De(cn.call(e)) : {};
        }
        function oi(e, t) {
          return new e.constructor(t ? ts(e.buffer) : e.buffer, e.byteOffset, e.length);
        }
        function ii(e, t) {
          if (e !== t) {
            var r = e !== c, n = e === null, i = e === e, u = pt(e), m = t !== c, g = t === null, A = t === t, E = pt(t);
            if (!g && !E && !u && e > t || u && m && A && !g && !E || n && m && A || !r && A || !i) return 1;
            if (!n && !u && !E && e < t || E && r && i && !n && !u || g && r && i || !m && i || !A) return -1;
          }
          return 0;
        }
        function Od(e, t, r) {
          for (var n = -1, i = e.a, u = t.a, m = i.length, g = r.length; ++n < m; ) {
            var A = ii(i[n], u[n]);
            if (A)
              return n >= g ? A : A * (r[n] == "desc" ? -1 : 1);
          }
          return e.b - t.b;
        }
        function li(e, t, r, n) {
          for (var i = -1, u = e.length, m = r.length, g = -1, A = t.length, E = $e(u - m, 0), P = je(A + E), D = !n; ++g < A; ) P[g] = t[g];
          for (; ++i < m; ) (D || i < u) && (P[r[i]] = e[i]);
          for (; E--; ) P[g++] = e[i++];
          return P;
        }
        function ci(e, t, r, n) {
          for (var i = -1, u = e.length, m = -1, g = r.length, A = -1, E = t.length, P = $e(u - g, 0), D = je(P + E), W = !n; ++i < P; ) D[i] = e[i];
          for (var Y = i; ++A < E; ) D[Y + A] = t[A];
          for (; ++m < g; ) (W || i < u) && (D[Y + r[m]] = e[i++]);
          return D;
        }
        function ot(e, t) {
          var r = -1, n = e.length;
          for (t || (t = je(n)); ++r < n; ) t[r] = e[r];
          return t;
        }
        function Lt(e, t, r, n) {
          var i = !r;
          r || (r = {});
          for (var u = -1, m = t.length; ++u < m; ) {
            var g = t[u], A = n ? n(r[g], e[g], g, r, e) : c;
            A === c && (A = e[g]), i ? Rt(r, g, A) : Jr(r, g, A);
          }
          return r;
        }
        function Ud(e, t) {
          return Lt(e, ks(e), t);
        }
        function Bd(e, t) {
          return Lt(e, fl(e), t);
        }
        function Dn(e, t) {
          return function(r, n) {
            var i = fe(r) ? p : ud, u = t ? t() : {};
            return i(r, e, ue(n, 2), u);
          };
        }
        function Tr(e) {
          return ve(function(t, r) {
            var n = -1, i = r.length, u = i > 1 ? r[i - 1] : c, m = i > 2 ? r[2] : c;
            for (u = e.length > 3 && typeof u == "function" ? (i--, u) : c, m && at(r[0], r[1], m) && (u = i < 3 ? c : u, i = 1), t = De(t); ++n < i; ) {
              var g = r[n];
              g && e(t, g, n, u);
            }
            return t;
          });
        }
        function ui(e, t) {
          return function(r, n) {
            if (r == null) return r;
            if (!it(r)) return e(r, n);
            for (var i = r.length, u = t ? i : -1, m = De(r); (t ? u-- : ++u < i) && n(m[u], u, m) !== !1; ) ;
            return r;
          };
        }
        function di(e) {
          return function(t, r, n) {
            for (var i = -1, u = De(t), m = n(t), g = m.length; g--; ) {
              var A = m[e ? g : ++i];
              if (r(u[A], A, u) === !1) break;
            }
            return t;
          };
        }
        function Fd(e, t, r) {
          function n() {
            return (this && this !== Ge && this instanceof n ? u : e).apply(i ? r : this, arguments);
          }
          var i = t & St, u = tn(e);
          return n;
        }
        function hi(e) {
          return function(t) {
            t = ke(t);
            var r = Ve(t) ? _e(t) : c, n = r ? r[0] : t.charAt(0), i = r ? nr(r, 1).join("") : t.slice(1);
            return n[e]() + i;
          };
        }
        function Er(e) {
          return function(t) {
            return T(Qi(Yi(t).replace(Au, "")), e, "");
          };
        }
        function tn(e) {
          return function() {
            var t = arguments;
            switch (t.length) {
              case 0:
                return new e();
              case 1:
                return new e(t[0]);
              case 2:
                return new e(t[0], t[1]);
              case 3:
                return new e(t[0], t[1], t[2]);
              case 4:
                return new e(t[0], t[1], t[2], t[3]);
              case 5:
                return new e(t[0], t[1], t[2], t[3], t[4]);
              case 6:
                return new e(t[0], t[1], t[2], t[3], t[4], t[5]);
              case 7:
                return new e(t[0], t[1], t[2], t[3], t[4], t[5], t[6]);
            }
            var r = Lr(e.prototype), n = e.apply(r, t);
            return ze(n) ? n : r;
          };
        }
        function jd(e, t, r) {
          function n() {
            for (var u = arguments.length, m = je(u), g = u, A = Nr(n); g--; ) m[g] = arguments[g];
            var E = u < 3 && m[0] !== A && m[u - 1] !== A ? [] : Ke(m, A);
            return u -= E.length, u < r ? vi(e, t, Rn, n.placeholder, c, m, E, c, c, r - u) : d(this && this !== Ge && this instanceof n ? i : e, this, m);
          }
          var i = tn(e);
          return n;
        }
        function pi(e) {
          return function(t, r, n) {
            var i = De(t);
            if (!it(t)) {
              var u = ue(r, 3);
              t = We(t), r = function(g) {
                return u(i[g], g, i);
              };
            }
            var m = e(t, r, n);
            return m > -1 ? i[u ? t[m] : m] : c;
          };
        }
        function fi(e) {
          return Gt(function(t) {
            var r = t.length, n = r, i = oe.prototype.thru;
            for (e && t.reverse(); n--; ) {
              var u = t[n];
              if (typeof u != "function") throw new wt(Q);
              if (i && !m && Un(u) == "wrapper") var m = new oe([], !0);
            }
            for (n = m ? n : r; ++n < r; ) {
              u = t[n];
              var g = Un(u), A = g == "wrapper" ? Is(u) : c;
              m = A && ls(A[0]) && A[1] == (Ft | Ut | Bt | jr) && !A[4].length && A[9] == 1 ? m[Un(A[0])].apply(m, A[3]) : u.length == 1 && ls(u) ? m[g]() : m.thru(u);
            }
            return function() {
              var E = arguments, P = E[0];
              if (m && E.length == 1 && fe(P)) return m.plant(P).value();
              for (var D = 0, W = r ? t[D].apply(this, E) : P; ++D < r; ) W = t[D].call(this, W);
              return W;
            };
          });
        }
        function Rn(e, t, r, n, i, u, m, g, A, E) {
          function P() {
            for (var be = arguments.length, we = je(be), et = be; et--; ) we[et] = arguments[et];
            if (re) var ut = Nr(P), ir = le(we, ut);
            if (n && (we = li(we, n, i, re)), u && (we = ci(we, u, m, re)), be -= ir, re && be < E)
              return vi(e, t, Rn, P.placeholder, r, we, Ke(we, ut), g, A, E - be);
            var Ue = W ? r : this, At = Y ? Ue[e] : e;
            return be = we.length, g ? we = oh(we, g) : me && be > 1 && we.reverse(), D && A < be && (we.length = A), this && this !== Ge && this instanceof P && (At = ee || tn(At)), At.apply(Ue, we);
          }
          var D = t & Ft, W = t & St, Y = t & xr, re = t & (Ut | Br), me = t & ba, ee = Y ? c : tn(e);
          return P;
        }
        function mi(e, t) {
          return function(r, n) {
            return yd(r, e, t(n), {});
          };
        }
        function zn(e, t) {
          return function(r, n) {
            var i;
            if (r === c && n === c) return t;
            if (r !== c && (i = r), n !== c) {
              if (i === c) return n;
              typeof r == "string" || typeof n == "string" ? (r = ht(r), n = ht(n)) : (r = ti(r), n = ti(n)), i = e(r, n);
            }
            return i;
          };
        }
        function rs(e) {
          return Gt(function(t) {
            return t = b(t, ye(ue())), ve(function(r) {
              var n = this;
              return e(t, function(i) {
                return d(i, n, r);
              });
            });
          });
        }
        function Ln(e, t) {
          t = t === c ? " " : ht(t);
          var r = t.length;
          if (r < 2) return r ? Ka(t, e) : t;
          var n = Ka(t, sa(e / pe(t)));
          return Ve(t) ? nr(_e(n), 0, e).join("") : n.slice(0, e);
        }
        function $d(e, t, r, n) {
          function i() {
            for (var g = -1, A = arguments.length, E = -1, P = n.length, D = je(P + A), W = this && this !== Ge && this instanceof i ? m : e; ++E < P; ) D[E] = n[E];
            for (; A--; ) D[E++] = arguments[++g];
            return d(W, u ? r : this, D);
          }
          var u = t & St, m = tn(e);
          return i;
        }
        function gi(e) {
          return function(t, r, n) {
            return n && typeof n != "number" && at(t, r, n) && (r = n = c), t = Kt(t), r === c ? (r = t, t = 0) : r = Kt(r), n = n === c ? t < r ? 1 : -1 : Kt(n), Ed(t, r, n, e);
          };
        }
        function On(e) {
          return function(t, r) {
            return typeof t == "string" && typeof r == "string" || (t = bt(t), r = bt(r)), e(t, r);
          };
        }
        function vi(e, t, r, n, i, u, m, g, A, E) {
          var P = t & Ut, D = P ? m : c, W = P ? c : m, Y = P ? u : c, re = P ? c : u;
          t |= P ? Bt : Fr, t &= ~(P ? Fr : Bt), t & to || (t &= -4);
          var me = [e, t, i, Y, D, re, W, g, A, E], ee = r.apply(c, me);
          return ls(e) && ml(ee, me), ee.placeholder = n, Pi(ee, e, t);
        }
        function ns(e) {
          var t = Mr[e];
          return function(r, n) {
            if (r = bt(r), n = n == null ? 0 : Ye(ge(n), 292), n && il(r)) {
              var i = (ke(r) + "e").split("e");
              return i = (ke(t(i[0] + "e" + (+i[1] + n))) + "e").split("e"), +(i[0] + "e" + (+i[1] - n));
            }
            return t(r);
          };
        }
        function yi(e) {
          return function(t) {
            var r = Qe(t);
            return r == It ? Te(t) : r == kt ? Je(t) : he(t, e(t));
          };
        }
        function Wt(e, t, r, n, i, u, m, g) {
          var A = t & xr;
          if (!A && typeof e != "function") throw new wt(Q);
          var E = n ? n.length : 0;
          if (E || (t &= -97, n = i = c), m = m === c ? m : $e(ge(m), 0), g = g === c ? g : ge(g), E -= i ? i.length : 0, t & Fr) {
            var P = n, D = i;
            n = i = c;
          }
          var W = A ? c : Is(e), Y = [e, t, r, n, i, P, D, u, m, g];
          if (W && nh(Y, W), e = Y[0], t = Y[1], r = Y[2], n = Y[3], i = Y[4], g = Y[9] = Y[9] === c ? A ? 0 : e.length : $e(Y[9] - E, 0), !g && t & (Ut | Br) && (t &= -25), t && t != St) re = t == Ut || t == Br ? jd(e, t, g) : t != Bt && t != (St | Bt) || i.length ? Rn.apply(c, Y) : $d(e, t, r, n);
          else var re = Fd(e, t, r);
          return Pi((W ? hl : ml)(re, Y), e, t);
        }
        function bi(e, t, r, n) {
          return e === c || Et(e, Dr[r]) && !Pe.call(n, r) ? t : e;
        }
        function wi(e, t, r, n, i, u) {
          return ze(e) && ze(t) && (u.set(t, e), Nn(e, t, c, wi, u), u.delete(t)), e;
        }
        function qd(e) {
          return nn(e) ? c : e;
        }
        function Ai(e, t, r, n, i, u) {
          var m = r & Cr, g = e.length, A = t.length;
          if (g != A && !(m && A > g)) return !1;
          var E = u.get(e), P = u.get(t);
          if (E && P) return E == t && P == e;
          var D = -1, W = !0, Y = r & bn ? new dr() : c;
          for (u.set(e, t), u.set(t, e); ++D < g; ) {
            var re = e[D], me = t[D];
            if (n) var ee = m ? n(me, re, D, t, e, u) : n(re, me, D, e, t, u);
            if (ee !== c) {
              if (ee) continue;
              W = !1;
              break;
            }
            if (Y) {
              if (!L(t, function(be, we) {
                if (!Ce(Y, we) && (re === be || i(re, be, r, n, u))) return Y.push(we);
              })) {
                W = !1;
                break;
              }
            } else if (re !== me && !i(re, me, r, n, u)) {
              W = !1;
              break;
            }
          }
          return u.delete(e), u.delete(t), W;
        }
        function Wd(e, t, r, n, i, u, m) {
          switch (r) {
            case Ir:
              if (e.byteLength != t.byteLength || e.byteOffset != t.byteOffset) return !1;
              e = e.buffer, t = t.buffer;
            case Kr:
              return !(e.byteLength != t.byteLength || !u(new ta(e), new ta(t)));
            case $r:
            case qr:
            case Wr:
              return Et(+e, +t);
            case _n:
              return e.name == t.name && e.message == t.message;
            case Gr:
            case Xr:
              return e == t + "";
            case It:
              var g = Te;
            case kt:
              var A = n & Cr;
              if (g || (g = rt), e.size != t.size && !A) return !1;
              var E = m.get(e);
              if (E) return E == t;
              n |= bn, m.set(e, t);
              var P = Ai(g(e), g(t), n, i, u, m);
              return m.delete(e), P;
            case xn:
              if (cn) return cn.call(e) == cn.call(t);
          }
          return !1;
        }
        function Gd(e, t, r, n, i, u) {
          var m = r & Cr, g = as(e), A = g.length;
          if (A != as(t).length && !m) return !1;
          for (var E = A; E--; ) {
            var P = g[E];
            if (!(m ? P in t : Pe.call(t, P))) return !1;
          }
          var D = u.get(e), W = u.get(t);
          if (D && W) return D == t && W == e;
          var Y = !0;
          u.set(e, t), u.set(t, e);
          for (var re = m; ++E < A; ) {
            P = g[E];
            var me = e[P], ee = t[P];
            if (n) var be = m ? n(ee, me, P, t, e, u) : n(me, ee, P, e, t, u);
            if (!(be === c ? me === ee || i(me, ee, r, n, u) : be)) {
              Y = !1;
              break;
            }
            re || (re = P == "constructor");
          }
          if (Y && !re) {
            var we = e.constructor, et = t.constructor;
            we != et && "constructor" in e && "constructor" in t && !(typeof we == "function" && we instanceof we && typeof et == "function" && et instanceof et) && (Y = !1);
          }
          return u.delete(e), u.delete(t), Y;
        }
        function Gt(e) {
          return Ps(Ii(e, c, Mi), e + "");
        }
        function as(e) {
          return $o(e, We, ks);
        }
        function ss(e) {
          return $o(e, lt, fl);
        }
        function Un(e) {
          for (var t = e.name + "", r = zr[t], n = Pe.call(zr, t) ? r.length : 0; n--; ) {
            var i = r[n], u = i.func;
            if (u == null || u == e) return i.name;
          }
          return t;
        }
        function Nr(e) {
          return (Pe.call(a, "placeholder") ? a : e).placeholder;
        }
        function ue() {
          var e = a.iteratee || gs;
          return e = e === gs ? Go : e, arguments.length ? e(arguments[0], arguments[1]) : e;
        }
        function Bn(e, t) {
          var r = e.__data__;
          return eh(t) ? r[typeof t == "string" ? "string" : "hash"] : r.map;
        }
        function os(e) {
          for (var t = We(e), r = t.length; r--; ) {
            var n = t[r], i = e[n];
            t[r] = [n, i, xi(i)];
          }
          return t;
        }
        function fr(e, t) {
          var r = qe(e, t);
          return Wo(r) ? r : c;
        }
        function Xd(e) {
          var t = Pe.call(e, gr), r = e[gr];
          try {
            e[gr] = c;
            var n = !0;
          } catch {
          }
          var i = Qn.call(e);
          return n && (t ? e[gr] = r : delete e[gr]), i;
        }
        function Vd(e, t, r) {
          for (var n = -1, i = r.length; ++n < i; ) {
            var u = r[n], m = u.size;
            switch (u.type) {
              case "drop":
                e += m;
                break;
              case "dropRight":
                t -= m;
                break;
              case "take":
                t = Ye(t, e + m);
                break;
              case "takeRight":
                e = $e(e, t - m);
            }
          }
          return { start: e, end: t };
        }
        function Kd(e) {
          var t = e.match(Xc);
          return t ? t[1].split(Vc) : [];
        }
        function _i(e, t, r) {
          t = rr(t, e);
          for (var n = -1, i = t.length, u = !1; ++n < i; ) {
            var m = Tt(t[n]);
            if (!(u = e != null && r(e, m))) break;
            e = e[m];
          }
          return u || ++n != i ? u : (i = e == null ? 0 : e.length, !!i && Gn(i) && Xt(m, i) && (fe(e) || vr(e)));
        }
        function Jd(e) {
          var t = e.length, r = new e.constructor(t);
          return t && typeof e[0] == "string" && Pe.call(e, "index") && (r.index = e.index, r.input = e.input), r;
        }
        function Ci(e) {
          return typeof e.constructor != "function" || rn(e) ? {} : Lr(ra(e));
        }
        function Zd(e, t, r) {
          var n = e.constructor;
          switch (t) {
            case Kr:
              return ts(e);
            case $r:
            case qr:
              return new n(+e);
            case Ir:
              return Rd(e, r);
            case wa:
            case Aa:
            case _a:
            case Ca:
            case xa:
            case Sa:
            case Ia:
            case ka:
            case Pa:
              return oi(e, r);
            case It:
              return new n();
            case Wr:
            case Xr:
              return new n(e);
            case Gr:
              return zd(e);
            case kt:
              return new n();
            case xn:
              return Ld(e);
          }
        }
        function Yd(e, t) {
          var r = t.length;
          if (!r) return e;
          var n = r - 1;
          return t[n] = (r > 1 ? "& " : "") + t[n], t = t.join(r > 2 ? ", " : " "), e.replace(Gc, `{
/* [wrapped with ` + t + `] */
`);
        }
        function Qd(e) {
          return fe(e) || vr(e) || !!(ol && e && e[ol]);
        }
        function Xt(e, t) {
          var r = typeof e;
          return t = t ?? er, !!t && (r == "number" || r != "symbol" && ru.test(e)) && e > -1 && e % 1 == 0 && e < t;
        }
        function at(e, t, r) {
          if (!ze(r)) return !1;
          var n = typeof t;
          return !!(n == "number" ? it(r) && Xt(t, r.length) : n == "string" && t in r) && Et(r[t], e);
        }
        function is(e, t) {
          if (fe(e)) return !1;
          var r = typeof e;
          return !(r != "number" && r != "symbol" && r != "boolean" && e != null && !pt(e)) || jc.test(e) || !Fc.test(e) || t != null && e in De(t);
        }
        function eh(e) {
          var t = typeof e;
          return t == "string" || t == "number" || t == "symbol" || t == "boolean" ? e !== "__proto__" : e === null;
        }
        function ls(e) {
          var t = Un(e), r = a[t];
          if (typeof r != "function" || !(t in K.prototype)) return !1;
          if (e === r) return !0;
          var n = Is(r);
          return !!n && e === n[0];
        }
        function th(e) {
          return !!rl && rl in e;
        }
        function rn(e) {
          var t = e && e.constructor;
          return e === (typeof t == "function" && t.prototype || Dr);
        }
        function xi(e) {
          return e === e && !ze(e);
        }
        function Si(e, t) {
          return function(r) {
            return r != null && r[e] === t && (t !== c || e in De(r));
          };
        }
        function rh(e) {
          var t = qn(e, function(n) {
            return r.size === vc && r.clear(), n;
          }), r = t.cache;
          return t;
        }
        function nh(e, t) {
          var r = e[1], n = t[1], i = r | n, u = i < (St | xr | Ft), m = n == Ft && r == Ut || n == Ft && r == jr && e[7].length <= t[8] || n == (Ft | jr) && t[7].length <= t[8] && r == Ut;
          if (!u && !m) return e;
          n & St && (e[2] = t[2], i |= r & St ? 0 : to);
          var g = t[3];
          if (g) {
            var A = e[3];
            e[3] = A ? li(A, g, t[4]) : g, e[4] = A ? Ke(e[3], yn) : t[4];
          }
          return g = t[5], g && (A = e[5], e[5] = A ? ci(A, g, t[6]) : g, e[6] = A ? Ke(e[5], yn) : t[6]), g = t[7], g && (e[7] = g), n & Ft && (e[8] = e[8] == null ? t[8] : Ye(e[8], t[8])), e[9] == null && (e[9] = t[9]), e[0] = t[0], e[1] = i, e;
        }
        function ah(e) {
          var t = [];
          if (e != null) for (var r in De(e)) t.push(r);
          return t;
        }
        function sh(e) {
          return Qn.call(e);
        }
        function Ii(e, t, r) {
          return t = $e(t === c ? e.length - 1 : t, 0), function() {
            for (var n = arguments, i = -1, u = $e(n.length - t, 0), m = je(u); ++i < u; ) m[i] = n[t + i];
            i = -1;
            for (var g = je(t + 1); ++i < t; ) g[i] = n[i];
            return g[t] = r(m), d(e, this, g);
          };
        }
        function ki(e, t) {
          return t.length < 2 ? e : pr(e, vt(t, 0, -1));
        }
        function oh(e, t) {
          for (var r = e.length, n = Ye(t.length, r), i = ot(e); n--; ) {
            var u = t[n];
            e[n] = Xt(u, r) ? i[u] : c;
          }
          return e;
        }
        function cs(e, t) {
          if ((t !== "constructor" || typeof e[t] != "function") && t != "__proto__") return e[t];
        }
        function Pi(e, t, r) {
          var n = t + "";
          return Ps(e, Yd(n, ih(Kd(n), r)));
        }
        function Ti(e) {
          var t = 0, r = 0;
          return function() {
            var n = gm(), i = Ac - (n - r);
            if (r = n, i > 0) {
              if (++t >= wc) return arguments[0];
            } else t = 0;
            return e.apply(c, arguments);
          };
        }
        function Fn(e, t) {
          var r = -1, n = e.length, i = n - 1;
          for (t = t === c ? n : t; ++r < t; ) {
            var u = Va(r, i), m = e[u];
            e[u] = e[r], e[r] = m;
          }
          return e.length = t, e;
        }
        function Tt(e) {
          if (typeof e == "string" || pt(e)) return e;
          var t = e + "";
          return t == "0" && 1 / e == -lr ? "-0" : t;
        }
        function mr(e) {
          if (e != null) {
            try {
              return Yn.call(e);
            } catch {
            }
            try {
              return e + "";
            } catch {
            }
          }
          return "";
        }
        function ih(e, t) {
          return h(kc, function(r) {
            var n = "_." + r[0];
            t & r[1] && !S(e, n) && e.push(n);
          }), e.sort();
        }
        function Ei(e) {
          if (e instanceof K) return e.clone();
          var t = new oe(e.__wrapped__, e.__chain__);
          return t.__actions__ = ot(e.__actions__), t.__index__ = e.__index__, t.__values__ = e.__values__, t;
        }
        function lh(e, t, r) {
          t = (r ? at(e, t, r) : t === c) ? 1 : $e(ge(t), 0);
          var n = e == null ? 0 : e.length;
          if (!n || t < 1) return [];
          for (var i = 0, u = 0, m = je(sa(n / t)); i < n; ) m[u++] = vt(e, i, i += t);
          return m;
        }
        function ch(e) {
          for (var t = -1, r = e == null ? 0 : e.length, n = 0, i = []; ++t < r; ) {
            var u = e[t];
            u && (i[n++] = u);
          }
          return i;
        }
        function uh() {
          var e = arguments.length;
          if (!e) return [];
          for (var t = je(e - 1), r = arguments[0], n = e; n--; ) t[n - 1] = arguments[n];
          return C(fe(r) ? ot(r) : [r], Xe(t, 1));
        }
        function dh(e, t, r) {
          var n = e == null ? 0 : e.length;
          return n ? (t = r || t === c ? 1 : ge(t), vt(e, t < 0 ? 0 : t, n)) : [];
        }
        function hh(e, t, r) {
          var n = e == null ? 0 : e.length;
          return n ? (t = r || t === c ? 1 : ge(t), t = n - t, vt(e, 0, t < 0 ? 0 : t)) : [];
        }
        function ph(e, t) {
          return e && e.length ? Mn(e, ue(t, 3), !0, !0) : [];
        }
        function fh(e, t) {
          return e && e.length ? Mn(e, ue(t, 3), !0) : [];
        }
        function mh(e, t, r, n) {
          var i = e == null ? 0 : e.length;
          return i ? (r && typeof r != "number" && at(e, t, r) && (r = 0, n = i), fd(e, t, r, n)) : [];
        }
        function Ni(e, t, r) {
          var n = e == null ? 0 : e.length;
          if (!n) return -1;
          var i = r == null ? 0 : ge(r);
          return i < 0 && (i = $e(n + i, 0)), M(e, ue(t, 3), i);
        }
        function Hi(e, t, r) {
          var n = e == null ? 0 : e.length;
          if (!n) return -1;
          var i = n - 1;
          return r !== c && (i = ge(r), i = r < 0 ? $e(n + i, 0) : Ye(i, n - 1)), M(e, ue(t, 3), i, !0);
        }
        function Mi(e) {
          return e != null && e.length ? Xe(e, 1) : [];
        }
        function gh(e) {
          return e != null && e.length ? Xe(e, lr) : [];
        }
        function vh(e, t) {
          return e != null && e.length ? (t = t === c ? 1 : ge(t), Xe(e, t)) : [];
        }
        function yh(e) {
          for (var t = -1, r = e == null ? 0 : e.length, n = {}; ++t < r; ) {
            var i = e[t];
            Rt(n, i[0], i[1]);
          }
          return n;
        }
        function Di(e) {
          return e && e.length ? e[0] : c;
        }
        function bh(e, t, r) {
          var n = e == null ? 0 : e.length;
          if (!n) return -1;
          var i = r == null ? 0 : ge(r);
          return i < 0 && (i = $e(n + i, 0)), F(e, t, i);
        }
        function wh(e) {
          return e != null && e.length ? vt(e, 0, -1) : [];
        }
        function Ah(e, t) {
          return e == null ? "" : fm.call(e, t);
        }
        function yt(e) {
          var t = e == null ? 0 : e.length;
          return t ? e[t - 1] : c;
        }
        function _h(e, t, r) {
          var n = e == null ? 0 : e.length;
          if (!n) return -1;
          var i = n;
          return r !== c && (i = ge(r), i = i < 0 ? $e(n + i, 0) : Ye(i, n - 1)), t === t ? Ie(e, t, i) : M(e, j, i, !0);
        }
        function Ch(e, t) {
          return e && e.length ? Jo(e, ge(t)) : c;
        }
        function Ri(e, t) {
          return e && e.length && t && t.length ? Xa(e, t) : e;
        }
        function xh(e, t, r) {
          return e && e.length && t && t.length ? Xa(e, t, ue(r, 2)) : e;
        }
        function Sh(e, t, r) {
          return e && e.length && t && t.length ? Xa(e, t, c, r) : e;
        }
        function Ih(e, t) {
          var r = [];
          if (!e || !e.length) return r;
          var n = -1, i = [], u = e.length;
          for (t = ue(t, 3); ++n < u; ) {
            var m = e[n];
            t(m, n, e) && (r.push(m), i.push(n));
          }
          return Qo(e, i), r;
        }
        function us(e) {
          return e == null ? e : ym.call(e);
        }
        function kh(e, t, r) {
          var n = e == null ? 0 : e.length;
          return n ? (r && typeof r != "number" && at(e, t, r) ? (t = 0, r = n) : (t = t == null ? 0 : ge(t), r = r === c ? n : ge(r)), vt(e, t, r)) : [];
        }
        function Ph(e, t) {
          return Hn(e, t);
        }
        function Th(e, t, r) {
          return Ja(e, t, ue(r, 2));
        }
        function Eh(e, t) {
          var r = e == null ? 0 : e.length;
          if (r) {
            var n = Hn(e, t);
            if (n < r && Et(e[n], t)) return n;
          }
          return -1;
        }
        function Nh(e, t) {
          return Hn(e, t, !0);
        }
        function Hh(e, t, r) {
          return Ja(e, t, ue(r, 2), !0);
        }
        function Mh(e, t) {
          if (e != null && e.length) {
            var r = Hn(e, t, !0) - 1;
            if (Et(e[r], t)) return r;
          }
          return -1;
        }
        function Dh(e) {
          return e && e.length ? ei(e) : [];
        }
        function Rh(e, t) {
          return e && e.length ? ei(e, ue(t, 2)) : [];
        }
        function zh(e) {
          var t = e == null ? 0 : e.length;
          return t ? vt(e, 1, t) : [];
        }
        function Lh(e, t, r) {
          return e && e.length ? (t = r || t === c ? 1 : ge(t), vt(e, 0, t < 0 ? 0 : t)) : [];
        }
        function Oh(e, t, r) {
          var n = e == null ? 0 : e.length;
          return n ? (t = r || t === c ? 1 : ge(t), t = n - t, vt(e, t < 0 ? 0 : t, n)) : [];
        }
        function Uh(e, t) {
          return e && e.length ? Mn(e, ue(t, 3), !1, !0) : [];
        }
        function Bh(e, t) {
          return e && e.length ? Mn(e, ue(t, 3)) : [];
        }
        function Fh(e) {
          return e && e.length ? tr(e) : [];
        }
        function jh(e, t) {
          return e && e.length ? tr(e, ue(t, 2)) : [];
        }
        function $h(e, t) {
          return t = typeof t == "function" ? t : c, e && e.length ? tr(e, c, t) : [];
        }
        function ds(e) {
          if (!e || !e.length) return [];
          var t = 0;
          return e = w(e, function(r) {
            if (Be(r)) return t = $e(r.length, t), !0;
          }), $(t, function(r) {
            return b(e, te(r));
          });
        }
        function zi(e, t) {
          if (!e || !e.length) return [];
          var r = ds(e);
          return t == null ? r : b(r, function(n) {
            return d(t, c, n);
          });
        }
        function qh(e, t) {
          return ai(e || [], t || [], Jr);
        }
        function Wh(e, t) {
          return ai(e || [], t || [], en);
        }
        function Li(e) {
          var t = a(e);
          return t.__chain__ = !0, t;
        }
        function Gh(e, t) {
          return t(e), e;
        }
        function jn(e, t) {
          return t(e);
        }
        function Xh() {
          return Li(this);
        }
        function Vh() {
          return new oe(this.value(), this.__chain__);
        }
        function Kh() {
          this.__values__ === c && (this.__values__ = Xi(this.value()));
          var e = this.__index__ >= this.__values__.length;
          return { done: e, value: e ? c : this.__values__[this.__index__++] };
        }
        function Jh() {
          return this;
        }
        function Zh(e) {
          for (var t, r = this; r instanceof V; ) {
            var n = Ei(r);
            n.__index__ = 0, n.__values__ = c, t ? i.__wrapped__ = n : t = n;
            var i = n;
            r = r.__wrapped__;
          }
          return i.__wrapped__ = e, t;
        }
        function Yh() {
          var e = this.__wrapped__;
          if (e instanceof K) {
            var t = e;
            return this.__actions__.length && (t = new K(this)), t = t.reverse(), t.__actions__.push({ func: jn, args: [us], thisArg: c }), new oe(t, this.__chain__);
          }
          return this.thru(us);
        }
        function Qh() {
          return ni(this.__wrapped__, this.__actions__);
        }
        function ep(e, t, r) {
          var n = fe(e) ? v : pd;
          return r && at(e, t, r) && (t = c), n(e, ue(t, 3));
        }
        function tp(e, t) {
          return (fe(e) ? w : jo)(e, ue(t, 3));
        }
        function rp(e, t) {
          return Xe($n(e, t), 1);
        }
        function np(e, t) {
          return Xe($n(e, t), lr);
        }
        function ap(e, t, r) {
          return r = r === c ? 1 : ge(r), Xe($n(e, t), r);
        }
        function Oi(e, t) {
          return (fe(e) ? h : sr)(e, ue(t, 3));
        }
        function Ui(e, t) {
          return (fe(e) ? f : ul)(e, ue(t, 3));
        }
        function sp(e, t, r, n) {
          e = it(e) ? e : Hr(e), r = r && !n ? ge(r) : 0;
          var i = e.length;
          return r < 0 && (r = $e(i + r, 0)), Xn(e) ? r <= i && e.indexOf(t, r) > -1 : !!i && F(e, t, r) > -1;
        }
        function $n(e, t) {
          return (fe(e) ? b : Xo)(e, ue(t, 3));
        }
        function op(e, t, r, n) {
          return e == null ? [] : (fe(t) || (t = t == null ? [] : [t]), r = n ? c : r, fe(r) || (r = r == null ? [] : [r]), Zo(e, t, r));
        }
        function ip(e, t, r) {
          var n = fe(e) ? T : ne, i = arguments.length < 3;
          return n(e, ue(t, 4), r, i, sr);
        }
        function lp(e, t, r) {
          var n = fe(e) ? x : ne, i = arguments.length < 3;
          return n(e, ue(t, 4), r, i, ul);
        }
        function cp(e, t) {
          return (fe(e) ? w : jo)(e, Wn(ue(t, 3)));
        }
        function up(e) {
          return (fe(e) ? Oo : Nd)(e);
        }
        function dp(e, t, r) {
          return t = (r ? at(e, t, r) : t === c) ? 1 : ge(t), (fe(e) ? ld : Hd)(e, t);
        }
        function hp(e) {
          return (fe(e) ? cd : Md)(e);
        }
        function pp(e) {
          if (e == null) return 0;
          if (it(e)) return Xn(e) ? pe(e) : e.length;
          var t = Qe(e);
          return t == It || t == kt ? e.size : Wa(e).length;
        }
        function fp(e, t, r) {
          var n = fe(e) ? L : Dd;
          return r && at(e, t, r) && (t = c), n(e, ue(t, 3));
        }
        function mp(e, t) {
          if (typeof t != "function") throw new wt(Q);
          return e = ge(e), function() {
            if (--e < 1) return t.apply(this, arguments);
          };
        }
        function Bi(e, t, r) {
          return t = r ? c : t, t = e && t == null ? e.length : t, Wt(e, Ft, c, c, c, c, t);
        }
        function Fi(e, t) {
          var r;
          if (typeof t != "function") throw new wt(Q);
          return e = ge(e), function() {
            return --e > 0 && (r = t.apply(this, arguments)), e <= 1 && (t = c), r;
          };
        }
        function ji(e, t, r) {
          t = r ? c : t;
          var n = Wt(e, Ut, c, c, c, c, c, t);
          return n.placeholder = ji.placeholder, n;
        }
        function $i(e, t, r) {
          t = r ? c : t;
          var n = Wt(e, Br, c, c, c, c, c, t);
          return n.placeholder = $i.placeholder, n;
        }
        function qi(e, t, r) {
          function n(Ue) {
            var At = W, dn = Y;
            return W = Y = c, we = Ue, me = e.apply(dn, At);
          }
          function i(Ue) {
            return we = Ue, ee = un(g, t), et ? n(Ue) : me;
          }
          function u(Ue) {
            var At = Ue - be, dn = Ue - we, kl = t - At;
            return ut ? Ye(kl, re - dn) : kl;
          }
          function m(Ue) {
            var At = Ue - be, dn = Ue - we;
            return be === c || At >= t || At < 0 || ut && dn >= re;
          }
          function g() {
            var Ue = ca();
            return m(Ue) ? A(Ue) : (ee = un(g, u(Ue)), c);
          }
          function A(Ue) {
            return ee = c, ir && W ? n(Ue) : (W = Y = c, me);
          }
          function E() {
            ee !== c && pl(ee), we = 0, W = be = Y = ee = c;
          }
          function P() {
            return ee === c ? me : A(ca());
          }
          function D() {
            var Ue = ca(), At = m(Ue);
            if (W = arguments, Y = this, be = Ue, At) {
              if (ee === c) return i(be);
              if (ut) return pl(ee), ee = un(g, t), n(be);
            }
            return ee === c && (ee = un(g, t)), me;
          }
          var W, Y, re, me, ee, be, we = 0, et = !1, ut = !1, ir = !0;
          if (typeof e != "function") throw new wt(Q);
          return t = bt(t) || 0, ze(r) && (et = !!r.leading, ut = "maxWait" in r, re = ut ? $e(bt(r.maxWait) || 0, t) : re, ir = "trailing" in r ? !!r.trailing : ir), D.cancel = E, D.flush = P, D;
        }
        function gp(e) {
          return Wt(e, ba);
        }
        function qn(e, t) {
          if (typeof e != "function" || t != null && typeof t != "function") throw new wt(Q);
          var r = function() {
            var n = arguments, i = t ? t.apply(this, n) : n[0], u = r.cache;
            if (u.has(i)) return u.get(i);
            var m = e.apply(this, n);
            return r.cache = u.set(i, m) || u, m;
          };
          return r.cache = new (qn.Cache || qt)(), r;
        }
        function Wn(e) {
          if (typeof e != "function") throw new wt(Q);
          return function() {
            var t = arguments;
            switch (t.length) {
              case 0:
                return !e.call(this);
              case 1:
                return !e.call(this, t[0]);
              case 2:
                return !e.call(this, t[0], t[1]);
              case 3:
                return !e.call(this, t[0], t[1], t[2]);
            }
            return !e.apply(this, t);
          };
        }
        function vp(e) {
          return Fi(2, e);
        }
        function yp(e, t) {
          if (typeof e != "function") throw new wt(Q);
          return t = t === c ? t : ge(t), ve(e, t);
        }
        function bp(e, t) {
          if (typeof e != "function") throw new wt(Q);
          return t = t == null ? 0 : $e(ge(t), 0), ve(function(r) {
            var n = r[t], i = nr(r, 0, t);
            return n && C(i, n), d(e, this, i);
          });
        }
        function wp(e, t, r) {
          var n = !0, i = !0;
          if (typeof e != "function") throw new wt(Q);
          return ze(r) && (n = "leading" in r ? !!r.leading : n, i = "trailing" in r ? !!r.trailing : i), qi(e, t, { leading: n, maxWait: t, trailing: i });
        }
        function Ap(e) {
          return Bi(e, 1);
        }
        function _p(e, t) {
          return Es(es(t), e);
        }
        function Cp() {
          if (!arguments.length) return [];
          var e = arguments[0];
          return fe(e) ? e : [e];
        }
        function xp(e) {
          return gt(e, _r);
        }
        function Sp(e, t) {
          return t = typeof t == "function" ? t : c, gt(e, _r, t);
        }
        function Ip(e) {
          return gt(e, Qt | _r);
        }
        function kp(e, t) {
          return t = typeof t == "function" ? t : c, gt(e, Qt | _r, t);
        }
        function Pp(e, t) {
          return t == null || Bo(e, t, We(t));
        }
        function Et(e, t) {
          return e === t || e !== e && t !== t;
        }
        function it(e) {
          return e != null && Gn(e.length) && !Vt(e);
        }
        function Be(e) {
          return Oe(e) && it(e);
        }
        function Tp(e) {
          return e === !0 || e === !1 || Oe(e) && nt(e) == $r;
        }
        function Ep(e) {
          return Oe(e) && e.nodeType === 1 && !nn(e);
        }
        function Np(e) {
          if (e == null) return !0;
          if (it(e) && (fe(e) || typeof e == "string" || typeof e.splice == "function" || or(e) || Or(e) || vr(e))) return !e.length;
          var t = Qe(e);
          if (t == It || t == kt) return !e.size;
          if (rn(e)) return !Wa(e).length;
          for (var r in e) if (Pe.call(e, r)) return !1;
          return !0;
        }
        function Hp(e, t) {
          return Qr(e, t);
        }
        function Mp(e, t, r) {
          r = typeof r == "function" ? r : c;
          var n = r ? r(e, t) : c;
          return n === c ? Qr(e, t, c, r) : !!n;
        }
        function hs(e) {
          if (!Oe(e)) return !1;
          var t = nt(e);
          return t == _n || t == Tc || typeof e.message == "string" && typeof e.name == "string" && !nn(e);
        }
        function Dp(e) {
          return typeof e == "number" && il(e);
        }
        function Vt(e) {
          if (!ze(e)) return !1;
          var t = nt(e);
          return t == Cn || t == no || t == Pc || t == Nc;
        }
        function Wi(e) {
          return typeof e == "number" && e == ge(e);
        }
        function Gn(e) {
          return typeof e == "number" && e > -1 && e % 1 == 0 && e <= er;
        }
        function ze(e) {
          var t = typeof e;
          return e != null && (t == "object" || t == "function");
        }
        function Oe(e) {
          return e != null && typeof e == "object";
        }
        function Rp(e, t) {
          return e === t || qa(e, t, os(t));
        }
        function zp(e, t, r) {
          return r = typeof r == "function" ? r : c, qa(e, t, os(t), r);
        }
        function Lp(e) {
          return Gi(e) && e != +e;
        }
        function Op(e) {
          if (km(e)) throw new Kn(Se);
          return Wo(e);
        }
        function Up(e) {
          return e === null;
        }
        function Bp(e) {
          return e == null;
        }
        function Gi(e) {
          return typeof e == "number" || Oe(e) && nt(e) == Wr;
        }
        function nn(e) {
          if (!Oe(e) || nt(e) != jt) return !1;
          var t = ra(e);
          if (t === null) return !0;
          var r = Pe.call(t, "constructor") && t.constructor;
          return typeof r == "function" && r instanceof r && Yn.call(r) == im;
        }
        function Fp(e) {
          return Wi(e) && e >= -er && e <= er;
        }
        function Xn(e) {
          return typeof e == "string" || !fe(e) && Oe(e) && nt(e) == Xr;
        }
        function pt(e) {
          return typeof e == "symbol" || Oe(e) && nt(e) == xn;
        }
        function jp(e) {
          return e === c;
        }
        function $p(e) {
          return Oe(e) && Qe(e) == Vr;
        }
        function qp(e) {
          return Oe(e) && nt(e) == Mc;
        }
        function Xi(e) {
          if (!e) return [];
          if (it(e)) return Xn(e) ? _e(e) : ot(e);
          if (an && e[an]) return Mt(e[an]());
          var t = Qe(e);
          return (t == It ? Te : t == kt ? rt : Hr)(e);
        }
        function Kt(e) {
          return e ? (e = bt(e), e === lr || e === -lr ? (e < 0 ? -1 : 1) * xc : e === e ? e : 0) : e === 0 ? e : 0;
        }
        function ge(e) {
          var t = Kt(e), r = t % 1;
          return t === t ? r ? t - r : t : 0;
        }
        function Vi(e) {
          return e ? hr(ge(e), 0, Dt) : 0;
        }
        function bt(e) {
          if (typeof e == "number") return e;
          if (pt(e)) return wn;
          if (ze(e)) {
            var t = typeof e.valueOf == "function" ? e.valueOf() : e;
            e = ze(t) ? t + "" : t;
          }
          if (typeof e != "string") return e === 0 ? e : +e;
          e = Ae(e);
          var r = Qc.test(e);
          return r || tu.test(e) ? Hu(e.slice(2), r ? 2 : 8) : Yc.test(e) ? wn : +e;
        }
        function Ki(e) {
          return Lt(e, lt(e));
        }
        function Wp(e) {
          return e ? hr(ge(e), -er, er) : e === 0 ? e : 0;
        }
        function ke(e) {
          return e == null ? "" : ht(e);
        }
        function Gp(e, t) {
          var r = Lr(e);
          return t == null ? r : Uo(r, t);
        }
        function Xp(e, t) {
          return U(e, ue(t, 3), zt);
        }
        function Vp(e, t) {
          return U(e, ue(t, 3), Fa);
        }
        function Kp(e, t) {
          return e == null ? e : Ss(e, ue(t, 3), lt);
        }
        function Jp(e, t) {
          return e == null ? e : dl(e, ue(t, 3), lt);
        }
        function Zp(e, t) {
          return e && zt(e, ue(t, 3));
        }
        function Yp(e, t) {
          return e && Fa(e, ue(t, 3));
        }
        function Qp(e) {
          return e == null ? [] : En(e, We(e));
        }
        function ef(e) {
          return e == null ? [] : En(e, lt(e));
        }
        function ps(e, t, r) {
          var n = e == null ? c : pr(e, t);
          return n === c ? r : n;
        }
        function tf(e, t) {
          return e != null && _i(e, t, md);
        }
        function fs(e, t) {
          return e != null && _i(e, t, gd);
        }
        function We(e) {
          return it(e) ? Lo(e) : Wa(e);
        }
        function lt(e) {
          return it(e) ? Lo(e, !0) : Id(e);
        }
        function rf(e, t) {
          var r = {};
          return t = ue(t, 3), zt(e, function(n, i, u) {
            Rt(r, t(n, i, u), n);
          }), r;
        }
        function nf(e, t) {
          var r = {};
          return t = ue(t, 3), zt(e, function(n, i, u) {
            Rt(r, i, t(n, i, u));
          }), r;
        }
        function af(e, t) {
          return Ji(e, Wn(ue(t)));
        }
        function Ji(e, t) {
          if (e == null) return {};
          var r = b(ss(e), function(n) {
            return [n];
          });
          return t = ue(t), Yo(e, r, function(n, i) {
            return t(n, i[0]);
          });
        }
        function sf(e, t, r) {
          t = rr(t, e);
          var n = -1, i = t.length;
          for (i || (i = 1, e = c); ++n < i; ) {
            var u = e == null ? c : e[Tt(t[n])];
            u === c && (n = i, u = r), e = Vt(u) ? u.call(e) : u;
          }
          return e;
        }
        function of(e, t, r) {
          return e == null ? e : en(e, t, r);
        }
        function lf(e, t, r, n) {
          return n = typeof n == "function" ? n : c, e == null ? e : en(e, t, r, n);
        }
        function cf(e, t, r) {
          var n = fe(e), i = n || or(e) || Or(e);
          if (t = ue(t, 4), r == null) {
            var u = e && e.constructor;
            r = i ? n ? new u() : [] : ze(e) && Vt(u) ? Lr(ra(e)) : {};
          }
          return (i ? h : zt)(e, function(m, g, A) {
            return t(r, m, g, A);
          }), r;
        }
        function uf(e, t) {
          return e == null || Za(e, t);
        }
        function df(e, t, r) {
          return e == null ? e : ri(e, t, es(r));
        }
        function hf(e, t, r, n) {
          return n = typeof n == "function" ? n : c, e == null ? e : ri(e, t, es(r), n);
        }
        function Hr(e) {
          return e == null ? [] : Ne(e, We(e));
        }
        function pf(e) {
          return e == null ? [] : Ne(e, lt(e));
        }
        function ff(e, t, r) {
          return r === c && (r = t, t = c), r !== c && (r = bt(r), r = r === r ? r : 0), t !== c && (t = bt(t), t = t === t ? t : 0), hr(bt(e), t, r);
        }
        function mf(e, t, r) {
          return t = Kt(t), r === c ? (r = t, t = 0) : r = Kt(r), e = bt(e), vd(e, t, r);
        }
        function gf(e, t, r) {
          if (r && typeof r != "boolean" && at(e, t, r) && (t = r = c), r === c && (typeof t == "boolean" ? (r = t, t = c) : typeof e == "boolean" && (r = e, e = c)), e === c && t === c ? (e = 0, t = 1) : (e = Kt(e), t === c ? (t = e, e = 0) : t = Kt(t)), e > t) {
            var n = e;
            e = t, t = n;
          }
          if (r || e % 1 || t % 1) {
            var i = ll();
            return Ye(e + i * (t - e + Nu("1e-" + ((i + "").length - 1))), t);
          }
          return Va(e, t);
        }
        function Zi(e) {
          return Ms(ke(e).toLowerCase());
        }
        function Yi(e) {
          return e = ke(e), e && e.replace(nu, Ru).replace(_u, "");
        }
        function vf(e, t, r) {
          e = ke(e), t = ht(t);
          var n = e.length;
          r = r === c ? n : hr(ge(r), 0, n);
          var i = r;
          return r -= t.length, r >= 0 && e.slice(r, i) == t;
        }
        function yf(e) {
          return e = ke(e), e && Oc.test(e) ? e.replace(oo, zu) : e;
        }
        function bf(e) {
          return e = ke(e), e && qc.test(e) ? e.replace(Ta, "\\$&") : e;
        }
        function wf(e, t, r) {
          e = ke(e), t = ge(t);
          var n = t ? pe(e) : 0;
          if (!t || n >= t) return e;
          var i = (t - n) / 2;
          return Ln(oa(i), r) + e + Ln(sa(i), r);
        }
        function Af(e, t, r) {
          e = ke(e), t = ge(t);
          var n = t ? pe(e) : 0;
          return t && n < t ? e + Ln(t - n, r) : e;
        }
        function _f(e, t, r) {
          e = ke(e), t = ge(t);
          var n = t ? pe(e) : 0;
          return t && n < t ? Ln(t - n, r) + e : e;
        }
        function Cf(e, t, r) {
          return r || t == null ? t = 0 : t && (t = +t), vm(ke(e).replace(Ea, ""), t || 0);
        }
        function xf(e, t, r) {
          return t = (r ? at(e, t, r) : t === c) ? 1 : ge(t), Ka(ke(e), t);
        }
        function Sf() {
          var e = arguments, t = ke(e[0]);
          return e.length < 3 ? t : t.replace(e[1], e[2]);
        }
        function If(e, t, r) {
          return r && typeof r != "number" && at(e, t, r) && (t = r = c), (r = r === c ? Dt : r >>> 0) ? (e = ke(e), e && (typeof t == "string" || t != null && !Ns(t)) && (t = ht(t), !t && Ve(e)) ? nr(_e(e), 0, r) : e.split(t, r)) : [];
        }
        function kf(e, t, r) {
          return e = ke(e), r = r == null ? 0 : hr(ge(r), 0, e.length), t = ht(t), e.slice(r, r + t.length) == t;
        }
        function Pf(e, t, r) {
          var n = a.templateSettings;
          r && at(e, t, r) && (t = c), e = ke(e), t = Hs({}, t, n, bi);
          var i = Hs({}, t.imports, n.imports, bi), u = We(i), m = Ne(i, u);
          h(u, function(ee) {
            if (lo.test(ee)) throw new Kn(Fe);
          });
          var g, A, E = 0, P = t.interpolate || Sn, D = "__p+='", W = As((t.escape || Sn).source + "|" + P.source + "|" + (P === io ? Zc : Sn).source + "|" + (t.evaluate || Sn).source + "|$", "g"), Y = Pe.call(t, "sourceURL") ? "//# sourceURL=" + (t.sourceURL + "").replace(/\s/g, " ") + `
` : "";
          e.replace(W, function(ee, be, we, et, ut, ir) {
            return we || (we = et), D += e.slice(E, ir).replace(au, xe), be && (g = !0, D += "'+__e(" + be + ")+'"), ut && (A = !0, D += "';" + ut + `;
__p+='`), we && (D += "'+((__t=(" + we + "))==null?'':__t)+'"), E = ir + ee.length, ee;
          }), D += "';";
          var re = Pe.call(t, "variable") && t.variable;
          if (re) {
            if (lo.test(re)) throw new Kn(Ze);
          } else D = "with(obj){" + D + "}";
          D = (A ? D.replace(Dc, "") : D).replace(Rc, "$1").replace(zc, "$1;"), D = "function(" + (re || "obj") + "){" + (re ? "" : "obj||(obj={});") + "var __t,__p=''" + (g ? ",__e=_.escape" : "") + (A ? ",__j=Array.prototype.join;function print(){__p+=__j.call(arguments,'')}" : ";") + D + "return __p}";
          var me = Il(function() {
            return tl(u, Y + "return " + D).apply(c, m);
          });
          if (me.source = D, hs(me)) throw me;
          return me;
        }
        function Tf(e) {
          return ke(e).toLowerCase();
        }
        function Ef(e) {
          return ke(e).toUpperCase();
        }
        function Nf(e, t, r) {
          if (e = ke(e), e && (r || t === c)) return Ae(e);
          if (!e || !(t = ht(t))) return e;
          var n = _e(e), i = _e(t);
          return nr(n, Le(n, i), ae(n, i) + 1).join("");
        }
        function Hf(e, t, r) {
          if (e = ke(e), e && (r || t === c)) return e.slice(0, X(e) + 1);
          if (!e || !(t = ht(t))) return e;
          var n = _e(e);
          return nr(n, 0, ae(n, _e(t)) + 1).join("");
        }
        function Mf(e, t, r) {
          if (e = ke(e), e && (r || t === c)) return e.replace(Ea, "");
          if (!e || !(t = ht(t))) return e;
          var n = _e(e);
          return nr(n, Le(n, _e(t))).join("");
        }
        function Df(e, t) {
          var r = yc, n = bc;
          if (ze(t)) {
            var i = "separator" in t ? t.separator : i;
            r = "length" in t ? ge(t.length) : r, n = "omission" in t ? ht(t.omission) : n;
          }
          e = ke(e);
          var u = e.length;
          if (Ve(e)) {
            var m = _e(e);
            u = m.length;
          }
          if (r >= u) return e;
          var g = r - pe(n);
          if (g < 1) return n;
          var A = m ? nr(m, 0, g).join("") : e.slice(0, g);
          if (i === c) return A + n;
          if (m && (g += A.length - g), Ns(i)) {
            if (e.slice(g).search(i)) {
              var E, P = A;
              for (i.global || (i = As(i.source, ke(co.exec(i)) + "g")), i.lastIndex = 0; E = i.exec(P); ) var D = E.index;
              A = A.slice(0, D === c ? g : D);
            }
          } else if (e.indexOf(ht(i), g) != g) {
            var W = A.lastIndexOf(i);
            W > -1 && (A = A.slice(0, W));
          }
          return A + n;
        }
        function Rf(e) {
          return e = ke(e), e && Lc.test(e) ? e.replace(so, Lu) : e;
        }
        function Qi(e, t, r) {
          return e = ke(e), t = r ? c : t, t === c ? ft(e) ? I(e) : H(e) : e.match(t) || [];
        }
        function zf(e) {
          var t = e == null ? 0 : e.length, r = ue();
          return e = t ? b(e, function(n) {
            if (typeof n[1] != "function") throw new wt(Q);
            return [r(n[0]), n[1]];
          }) : [], ve(function(n) {
            for (var i = -1; ++i < t; ) {
              var u = e[i];
              if (d(u[0], this, n)) return d(u[1], this, n);
            }
          });
        }
        function Lf(e) {
          return hd(gt(e, Qt));
        }
        function ms(e) {
          return function() {
            return e;
          };
        }
        function Of(e, t) {
          return e == null || e !== e ? t : e;
        }
        function ct(e) {
          return e;
        }
        function gs(e) {
          return Go(typeof e == "function" ? e : gt(e, Qt));
        }
        function Uf(e) {
          return Vo(gt(e, Qt));
        }
        function Bf(e, t) {
          return Ko(e, gt(t, Qt));
        }
        function vs(e, t, r) {
          var n = We(t), i = En(t, n);
          r != null || ze(t) && (i.length || !n.length) || (r = t, t = e, e = this, i = En(t, We(t)));
          var u = !(ze(r) && "chain" in r && !r.chain), m = Vt(e);
          return h(i, function(g) {
            var A = t[g];
            e[g] = A, m && (e.prototype[g] = function() {
              var E = this.__chain__;
              if (u || E) {
                var P = e(this.__wrapped__);
                return (P.__actions__ = ot(this.__actions__)).push({ func: A, args: arguments, thisArg: e }), P.__chain__ = E, P;
              }
              return A.apply(e, C([this.value()], arguments));
            });
          }), e;
        }
        function Ff() {
          return Ge._ === this && (Ge._ = lm), this;
        }
        function ys() {
        }
        function jf(e) {
          return e = ge(e), ve(function(t) {
            return Jo(t, e);
          });
        }
        function el(e) {
          return is(e) ? te(Tt(e)) : Td(e);
        }
        function $f(e) {
          return function(t) {
            return e == null ? c : pr(e, t);
          };
        }
        function bs() {
          return [];
        }
        function ws() {
          return !1;
        }
        function qf() {
          return {};
        }
        function Wf() {
          return "";
        }
        function Gf() {
          return !0;
        }
        function Xf(e, t) {
          if (e = ge(e), e < 1 || e > er) return [];
          var r = Dt, n = Ye(e, Dt);
          t = ue(t), e -= Dt;
          for (var i = $(n, t); ++r < e; ) t(r);
          return i;
        }
        function Vf(e) {
          return fe(e) ? b(e, Tt) : pt(e) ? [e] : ot(gl(ke(e)));
        }
        function Kf(e) {
          var t = ++om;
          return ke(e) + t;
        }
        function Jf(e) {
          return e && e.length ? Tn(e, ct, ja) : c;
        }
        function Zf(e, t) {
          return e && e.length ? Tn(e, ue(t, 2), ja) : c;
        }
        function Yf(e) {
          return se(e, ct);
        }
        function Qf(e, t) {
          return se(e, ue(t, 2));
        }
        function em(e) {
          return e && e.length ? Tn(e, ct, Ga) : c;
        }
        function tm(e, t) {
          return e && e.length ? Tn(e, ue(t, 2), Ga) : c;
        }
        function rm(e) {
          return e && e.length ? z(e, ct) : 0;
        }
        function nm(e, t) {
          return e && e.length ? z(e, ue(t, 2)) : 0;
        }
        k = k == null ? Ge : Pr.defaults(Ge.Object(), k, Pr.pick(Ge, Iu));
        var je = k.Array, Vn = k.Date, Kn = k.Error, tl = k.Function, Mr = k.Math, De = k.Object, As = k.RegExp, am = k.String, wt = k.TypeError, Jn = je.prototype, sm = tl.prototype, Dr = De.prototype, Zn = k["__core-js_shared__"], Yn = sm.toString, Pe = Dr.hasOwnProperty, om = 0, rl = (function() {
          var e = /[^.]+$/.exec(Zn && Zn.keys && Zn.keys.IE_PROTO || "");
          return e ? "Symbol(src)_1." + e : "";
        })(), Qn = Dr.toString, im = Yn.call(De), lm = Ge._, cm = As("^" + Yn.call(Pe).replace(Ta, "\\$&").replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g, "$1.*?") + "$"), ea = Eo ? k.Buffer : c, ar = k.Symbol, ta = k.Uint8Array, nl = ea ? ea.allocUnsafe : c, ra = xt(De.getPrototypeOf, De), al = De.create, sl = Dr.propertyIsEnumerable, na = Jn.splice, ol = ar ? ar.isConcatSpreadable : c, an = ar ? ar.iterator : c, gr = ar ? ar.toStringTag : c, aa = (function() {
          try {
            var e = fr(De, "defineProperty");
            return e({}, "", {}), e;
          } catch {
          }
        })(), um = k.clearTimeout !== Ge.clearTimeout && k.clearTimeout, dm = Vn && Vn.now !== Ge.Date.now && Vn.now, hm = k.setTimeout !== Ge.setTimeout && k.setTimeout, sa = Mr.ceil, oa = Mr.floor, _s = De.getOwnPropertySymbols, pm = ea ? ea.isBuffer : c, il = k.isFinite, fm = Jn.join, mm = xt(De.keys, De), $e = Mr.max, Ye = Mr.min, gm = Vn.now, vm = k.parseInt, ll = Mr.random, ym = Jn.reverse, Cs = fr(k, "DataView"), sn = fr(k, "Map"), xs = fr(k, "Promise"), Rr = fr(k, "Set"), on = fr(k, "WeakMap"), ln = fr(De, "create"), ia = on && new on(), zr = {}, bm = mr(Cs), wm = mr(sn), Am = mr(xs), _m = mr(Rr), Cm = mr(on), la = ar ? ar.prototype : c, cn = la ? la.valueOf : c, cl = la ? la.toString : c, Lr = /* @__PURE__ */ (function() {
          function e() {
          }
          return function(t) {
            if (!ze(t)) return {};
            if (al) return al(t);
            e.prototype = t;
            var r = new e();
            return e.prototype = c, r;
          };
        })();
        a.templateSettings = { escape: Uc, evaluate: Bc, interpolate: io, variable: "", imports: { _: a } }, a.prototype = V.prototype, a.prototype.constructor = a, oe.prototype = Lr(V.prototype), oe.prototype.constructor = oe, K.prototype = Lr(V.prototype), K.prototype.constructor = K, ur.prototype.clear = Bu, ur.prototype.delete = Fu, ur.prototype.get = ju, ur.prototype.has = $u, ur.prototype.set = qu, $t.prototype.clear = Wu, $t.prototype.delete = Gu, $t.prototype.get = Xu, $t.prototype.has = Vu, $t.prototype.set = Ku, qt.prototype.clear = Ju, qt.prototype.delete = Zu, qt.prototype.get = Yu, qt.prototype.has = Qu, qt.prototype.set = ed, dr.prototype.add = dr.prototype.push = td, dr.prototype.has = rd, Pt.prototype.clear = nd, Pt.prototype.delete = ad, Pt.prototype.get = sd, Pt.prototype.has = od, Pt.prototype.set = id;
        var sr = ui(zt), ul = ui(Fa, !0), Ss = di(), dl = di(!0), hl = ia ? function(e, t) {
          return ia.set(e, t), e;
        } : ct, xm = aa ? function(e, t) {
          return aa(e, "toString", {
            configurable: !0,
            enumerable: !1,
            value: ms(t),
            writable: !0
          });
        } : ct, Sm = ve, pl = um || function(e) {
          return Ge.clearTimeout(e);
        }, Im = Rr && 1 / rt(new Rr([, -0]))[1] == lr ? function(e) {
          return new Rr(e);
        } : ys, Is = ia ? function(e) {
          return ia.get(e);
        } : ys, ks = _s ? function(e) {
          return e == null ? [] : (e = De(e), w(_s(e), function(t) {
            return sl.call(e, t);
          }));
        } : bs, fl = _s ? function(e) {
          for (var t = []; e; ) C(t, ks(e)), e = ra(e);
          return t;
        } : bs, Qe = nt;
        (Cs && Qe(new Cs(new ArrayBuffer(1))) != Ir || sn && Qe(new sn()) != It || xs && Qe(xs.resolve()) != ao || Rr && Qe(new Rr()) != kt || on && Qe(new on()) != Vr) && (Qe = function(e) {
          var t = nt(e), r = t == jt ? e.constructor : c, n = r ? mr(r) : "";
          if (n) switch (n) {
            case bm:
              return Ir;
            case wm:
              return It;
            case Am:
              return ao;
            case _m:
              return kt;
            case Cm:
              return Vr;
          }
          return t;
        });
        var km = Zn ? Vt : ws, ml = Ti(hl), un = hm || function(e, t) {
          return Ge.setTimeout(e, t);
        }, Ps = Ti(xm), gl = rh(function(e) {
          var t = [];
          return e.charCodeAt(0) === 46 && t.push(""), e.replace($c, function(r, n, i, u) {
            t.push(i ? u.replace(Jc, "$1") : n || r);
          }), t;
        }), Pm = ve(function(e, t) {
          return Be(e) ? Zr(e, Xe(t, 1, Be, !0)) : [];
        }), Tm = ve(function(e, t) {
          var r = yt(t);
          return Be(r) && (r = c), Be(e) ? Zr(e, Xe(t, 1, Be, !0), ue(r, 2)) : [];
        }), Em = ve(function(e, t) {
          var r = yt(t);
          return Be(r) && (r = c), Be(e) ? Zr(e, Xe(t, 1, Be, !0), c, r) : [];
        }), Nm = ve(function(e) {
          var t = b(e, Qa);
          return t.length && t[0] === e[0] ? $a(t) : [];
        }), Hm = ve(function(e) {
          var t = yt(e), r = b(e, Qa);
          return t === yt(r) ? t = c : r.pop(), r.length && r[0] === e[0] ? $a(r, ue(t, 2)) : [];
        }), Mm = ve(function(e) {
          var t = yt(e), r = b(e, Qa);
          return t = typeof t == "function" ? t : c, t && r.pop(), r.length && r[0] === e[0] ? $a(r, c, t) : [];
        }), Dm = ve(Ri), Rm = Gt(function(e, t) {
          var r = e == null ? 0 : e.length, n = Ba(e, t);
          return Qo(e, b(t, function(i) {
            return Xt(i, r) ? +i : i;
          }).sort(ii)), n;
        }), zm = ve(function(e) {
          return tr(Xe(e, 1, Be, !0));
        }), Lm = ve(function(e) {
          var t = yt(e);
          return Be(t) && (t = c), tr(Xe(e, 1, Be, !0), ue(t, 2));
        }), Om = ve(function(e) {
          var t = yt(e);
          return t = typeof t == "function" ? t : c, tr(Xe(e, 1, Be, !0), c, t);
        }), Um = ve(function(e, t) {
          return Be(e) ? Zr(e, t) : [];
        }), Bm = ve(function(e) {
          return Ya(w(e, Be));
        }), Fm = ve(function(e) {
          var t = yt(e);
          return Be(t) && (t = c), Ya(w(e, Be), ue(t, 2));
        }), jm = ve(function(e) {
          var t = yt(e);
          return t = typeof t == "function" ? t : c, Ya(w(e, Be), c, t);
        }), $m = ve(ds), qm = ve(function(e) {
          var t = e.length, r = t > 1 ? e[t - 1] : c;
          return r = typeof r == "function" ? (e.pop(), r) : c, zi(e, r);
        }), Wm = Gt(function(e) {
          var t = e.length, r = t ? e[0] : 0, n = this.__wrapped__, i = function(u) {
            return Ba(u, e);
          };
          return !(t > 1 || this.__actions__.length) && n instanceof K && Xt(r) ? (n = n.slice(r, +r + (t ? 1 : 0)), n.__actions__.push({ func: jn, args: [i], thisArg: c }), new oe(n, this.__chain__).thru(function(u) {
            return t && !u.length && u.push(c), u;
          })) : this.thru(i);
        }), Gm = Dn(function(e, t, r) {
          Pe.call(e, r) ? ++e[r] : Rt(e, r, 1);
        }), Xm = pi(Ni), Vm = pi(Hi), Km = Dn(function(e, t, r) {
          Pe.call(e, r) ? e[r].push(t) : Rt(e, r, [t]);
        }), Jm = ve(function(e, t, r) {
          var n = -1, i = typeof t == "function", u = it(e) ? je(e.length) : [];
          return sr(e, function(m) {
            u[++n] = i ? d(t, m, r) : Yr(m, t, r);
          }), u;
        }), Zm = Dn(function(e, t, r) {
          Rt(e, r, t);
        }), Ym = Dn(function(e, t, r) {
          e[r ? 0 : 1].push(t);
        }, function() {
          return [[], []];
        }), Qm = ve(function(e, t) {
          if (e == null) return [];
          var r = t.length;
          return r > 1 && at(e, t[0], t[1]) ? t = [] : r > 2 && at(t[0], t[1], t[2]) && (t = [t[0]]), Zo(e, Xe(t, 1), []);
        }), ca = dm || function() {
          return Ge.Date.now();
        }, Ts = ve(function(e, t, r) {
          var n = St;
          if (r.length) {
            var i = Ke(r, Nr(Ts));
            n |= Bt;
          }
          return Wt(e, n, t, r, i);
        }), vl = ve(function(e, t, r) {
          var n = St | xr;
          if (r.length) {
            var i = Ke(r, Nr(vl));
            n |= Bt;
          }
          return Wt(t, n, e, r, i);
        }), eg = ve(function(e, t) {
          return Fo(e, 1, t);
        }), tg = ve(function(e, t, r) {
          return Fo(e, bt(t) || 0, r);
        });
        qn.Cache = qt;
        var rg = Sm(function(e, t) {
          t = t.length == 1 && fe(t[0]) ? b(t[0], ye(ue())) : b(Xe(t, 1), ye(ue()));
          var r = t.length;
          return ve(function(n) {
            for (var i = -1, u = Ye(n.length, r); ++i < u; ) n[i] = t[i].call(this, n[i]);
            return d(e, this, n);
          });
        }), Es = ve(function(e, t) {
          return Wt(e, Bt, c, t, Ke(t, Nr(Es)));
        }), yl = ve(function(e, t) {
          return Wt(e, Fr, c, t, Ke(t, Nr(yl)));
        }), ng = Gt(function(e, t) {
          return Wt(e, jr, c, c, c, t);
        }), ag = On(ja), sg = On(function(e, t) {
          return e >= t;
        }), vr = qo(/* @__PURE__ */ (function() {
          return arguments;
        })()) ? qo : function(e) {
          return Oe(e) && Pe.call(e, "callee") && !sl.call(e, "callee");
        }, fe = je.isArray, og = No ? ye(No) : bd, or = pm || ws, ig = Ho ? ye(Ho) : wd, bl = Mo ? ye(Mo) : _d, Ns = Do ? ye(Do) : Cd, wl = Ro ? ye(Ro) : xd, Or = zo ? ye(zo) : Sd, lg = On(Ga), cg = On(function(e, t) {
          return e <= t;
        }), ug = Tr(function(e, t) {
          if (rn(t) || it(t)) return Lt(t, We(t), e), c;
          for (var r in t) Pe.call(t, r) && Jr(e, r, t[r]);
        }), Al = Tr(function(e, t) {
          Lt(t, lt(t), e);
        }), _l = Tr(function(e, t, r, n) {
          Lt(t, lt(t), e, n);
        }), Hs = Tr(function(e, t, r, n) {
          Lt(t, We(t), e, n);
        }), dg = Gt(Ba), hg = ve(function(e, t) {
          e = De(e);
          var r = -1, n = t.length, i = n > 2 ? t[2] : c;
          for (i && at(t[0], t[1], i) && (n = 1); ++r < n; ) for (var u = t[r], m = lt(u), g = -1, A = m.length; ++g < A; ) {
            var E = m[g], P = e[E];
            (P === c || Et(P, Dr[E]) && !Pe.call(e, E)) && (e[E] = u[E]);
          }
          return e;
        }), pg = ve(function(e) {
          return e.push(c, wi), d(Cl, c, e);
        }), fg = mi(function(e, t, r) {
          t != null && typeof t.toString != "function" && (t = Qn.call(t)), e[t] = r;
        }, ms(ct)), mg = mi(function(e, t, r) {
          t != null && typeof t.toString != "function" && (t = Qn.call(t)), Pe.call(e, t) ? e[t].push(r) : e[t] = [r];
        }, ue), gg = ve(Yr), vg = Tr(function(e, t, r) {
          Nn(e, t, r);
        }), Cl = Tr(function(e, t, r, n) {
          Nn(e, t, r, n);
        }), yg = Gt(function(e, t) {
          var r = {};
          if (e == null) return r;
          var n = !1;
          t = b(t, function(u) {
            return u = rr(u, e), n || (n = u.length > 1), u;
          }), Lt(e, ss(e), r), n && (r = gt(r, Qt | eo | _r, qd));
          for (var i = t.length; i--; ) Za(r, t[i]);
          return r;
        }), bg = Gt(function(e, t) {
          return e == null ? {} : Pd(e, t);
        }), xl = yi(We), Sl = yi(lt), wg = Er(function(e, t, r) {
          return t = t.toLowerCase(), e + (r ? Zi(t) : t);
        }), Ag = Er(function(e, t, r) {
          return e + (r ? "-" : "") + t.toLowerCase();
        }), _g = Er(function(e, t, r) {
          return e + (r ? " " : "") + t.toLowerCase();
        }), Cg = hi("toLowerCase"), xg = Er(function(e, t, r) {
          return e + (r ? "_" : "") + t.toLowerCase();
        }), Sg = Er(function(e, t, r) {
          return e + (r ? " " : "") + Ms(t);
        }), Ig = Er(function(e, t, r) {
          return e + (r ? " " : "") + t.toUpperCase();
        }), Ms = hi("toUpperCase"), Il = ve(function(e, t) {
          try {
            return d(e, c, t);
          } catch (r) {
            return hs(r) ? r : new Kn(r);
          }
        }), kg = Gt(function(e, t) {
          return h(t, function(r) {
            r = Tt(r), Rt(e, r, Ts(e[r], e));
          }), e;
        }), Pg = fi(), Tg = fi(!0), Eg = ve(function(e, t) {
          return function(r) {
            return Yr(r, e, t);
          };
        }), Ng = ve(function(e, t) {
          return function(r) {
            return Yr(e, r, t);
          };
        }), Hg = rs(b), Mg = rs(v), Dg = rs(L), Rg = gi(), zg = gi(!0), Lg = zn(function(e, t) {
          return e + t;
        }, 0), Og = ns("ceil"), Ug = zn(function(e, t) {
          return e / t;
        }, 1), Bg = ns("floor"), Fg = zn(function(e, t) {
          return e * t;
        }, 1), jg = ns("round"), $g = zn(function(e, t) {
          return e - t;
        }, 0);
        return a.after = mp, a.ary = Bi, a.assign = ug, a.assignIn = Al, a.assignInWith = _l, a.assignWith = Hs, a.at = dg, a.before = Fi, a.bind = Ts, a.bindAll = kg, a.bindKey = vl, a.castArray = Cp, a.chain = Li, a.chunk = lh, a.compact = ch, a.concat = uh, a.cond = zf, a.conforms = Lf, a.constant = ms, a.countBy = Gm, a.create = Gp, a.curry = ji, a.curryRight = $i, a.debounce = qi, a.defaults = hg, a.defaultsDeep = pg, a.defer = eg, a.delay = tg, a.difference = Pm, a.differenceBy = Tm, a.differenceWith = Em, a.drop = dh, a.dropRight = hh, a.dropRightWhile = ph, a.dropWhile = fh, a.fill = mh, a.filter = tp, a.flatMap = rp, a.flatMapDeep = np, a.flatMapDepth = ap, a.flatten = Mi, a.flattenDeep = gh, a.flattenDepth = vh, a.flip = gp, a.flow = Pg, a.flowRight = Tg, a.fromPairs = yh, a.functions = Qp, a.functionsIn = ef, a.groupBy = Km, a.initial = wh, a.intersection = Nm, a.intersectionBy = Hm, a.intersectionWith = Mm, a.invert = fg, a.invertBy = mg, a.invokeMap = Jm, a.iteratee = gs, a.keyBy = Zm, a.keys = We, a.keysIn = lt, a.map = $n, a.mapKeys = rf, a.mapValues = nf, a.matches = Uf, a.matchesProperty = Bf, a.memoize = qn, a.merge = vg, a.mergeWith = Cl, a.method = Eg, a.methodOf = Ng, a.mixin = vs, a.negate = Wn, a.nthArg = jf, a.omit = yg, a.omitBy = af, a.once = vp, a.orderBy = op, a.over = Hg, a.overArgs = rg, a.overEvery = Mg, a.overSome = Dg, a.partial = Es, a.partialRight = yl, a.partition = Ym, a.pick = bg, a.pickBy = Ji, a.property = el, a.propertyOf = $f, a.pull = Dm, a.pullAll = Ri, a.pullAllBy = xh, a.pullAllWith = Sh, a.pullAt = Rm, a.range = Rg, a.rangeRight = zg, a.rearg = ng, a.reject = cp, a.remove = Ih, a.rest = yp, a.reverse = us, a.sampleSize = dp, a.set = of, a.setWith = lf, a.shuffle = hp, a.slice = kh, a.sortBy = Qm, a.sortedUniq = Dh, a.sortedUniqBy = Rh, a.split = If, a.spread = bp, a.tail = zh, a.take = Lh, a.takeRight = Oh, a.takeRightWhile = Uh, a.takeWhile = Bh, a.tap = Gh, a.throttle = wp, a.thru = jn, a.toArray = Xi, a.toPairs = xl, a.toPairsIn = Sl, a.toPath = Vf, a.toPlainObject = Ki, a.transform = cf, a.unary = Ap, a.union = zm, a.unionBy = Lm, a.unionWith = Om, a.uniq = Fh, a.uniqBy = jh, a.uniqWith = $h, a.unset = uf, a.unzip = ds, a.unzipWith = zi, a.update = df, a.updateWith = hf, a.values = Hr, a.valuesIn = pf, a.without = Um, a.words = Qi, a.wrap = _p, a.xor = Bm, a.xorBy = Fm, a.xorWith = jm, a.zip = $m, a.zipObject = qh, a.zipObjectDeep = Wh, a.zipWith = qm, a.entries = xl, a.entriesIn = Sl, a.extend = Al, a.extendWith = _l, vs(a, a), a.add = Lg, a.attempt = Il, a.camelCase = wg, a.capitalize = Zi, a.ceil = Og, a.clamp = ff, a.clone = xp, a.cloneDeep = Ip, a.cloneDeepWith = kp, a.cloneWith = Sp, a.conformsTo = Pp, a.deburr = Yi, a.defaultTo = Of, a.divide = Ug, a.endsWith = vf, a.eq = Et, a.escape = yf, a.escapeRegExp = bf, a.every = ep, a.find = Xm, a.findIndex = Ni, a.findKey = Xp, a.findLast = Vm, a.findLastIndex = Hi, a.findLastKey = Vp, a.floor = Bg, a.forEach = Oi, a.forEachRight = Ui, a.forIn = Kp, a.forInRight = Jp, a.forOwn = Zp, a.forOwnRight = Yp, a.get = ps, a.gt = ag, a.gte = sg, a.has = tf, a.hasIn = fs, a.head = Di, a.identity = ct, a.includes = sp, a.indexOf = bh, a.inRange = mf, a.invoke = gg, a.isArguments = vr, a.isArray = fe, a.isArrayBuffer = og, a.isArrayLike = it, a.isArrayLikeObject = Be, a.isBoolean = Tp, a.isBuffer = or, a.isDate = ig, a.isElement = Ep, a.isEmpty = Np, a.isEqual = Hp, a.isEqualWith = Mp, a.isError = hs, a.isFinite = Dp, a.isFunction = Vt, a.isInteger = Wi, a.isLength = Gn, a.isMap = bl, a.isMatch = Rp, a.isMatchWith = zp, a.isNaN = Lp, a.isNative = Op, a.isNil = Bp, a.isNull = Up, a.isNumber = Gi, a.isObject = ze, a.isObjectLike = Oe, a.isPlainObject = nn, a.isRegExp = Ns, a.isSafeInteger = Fp, a.isSet = wl, a.isString = Xn, a.isSymbol = pt, a.isTypedArray = Or, a.isUndefined = jp, a.isWeakMap = $p, a.isWeakSet = qp, a.join = Ah, a.kebabCase = Ag, a.last = yt, a.lastIndexOf = _h, a.lowerCase = _g, a.lowerFirst = Cg, a.lt = lg, a.lte = cg, a.max = Jf, a.maxBy = Zf, a.mean = Yf, a.meanBy = Qf, a.min = em, a.minBy = tm, a.stubArray = bs, a.stubFalse = ws, a.stubObject = qf, a.stubString = Wf, a.stubTrue = Gf, a.multiply = Fg, a.nth = Ch, a.noConflict = Ff, a.noop = ys, a.now = ca, a.pad = wf, a.padEnd = Af, a.padStart = _f, a.parseInt = Cf, a.random = gf, a.reduce = ip, a.reduceRight = lp, a.repeat = xf, a.replace = Sf, a.result = sf, a.round = jg, a.runInContext = y, a.sample = up, a.size = pp, a.snakeCase = xg, a.some = fp, a.sortedIndex = Ph, a.sortedIndexBy = Th, a.sortedIndexOf = Eh, a.sortedLastIndex = Nh, a.sortedLastIndexBy = Hh, a.sortedLastIndexOf = Mh, a.startCase = Sg, a.startsWith = kf, a.subtract = $g, a.sum = rm, a.sumBy = nm, a.template = Pf, a.times = Xf, a.toFinite = Kt, a.toInteger = ge, a.toLength = Vi, a.toLower = Tf, a.toNumber = bt, a.toSafeInteger = Wp, a.toString = ke, a.toUpper = Ef, a.trim = Nf, a.trimEnd = Hf, a.trimStart = Mf, a.truncate = Df, a.unescape = Rf, a.uniqueId = Kf, a.upperCase = Ig, a.upperFirst = Ms, a.each = Oi, a.eachRight = Ui, a.first = Di, vs(a, (function() {
          var e = {};
          return zt(a, function(t, r) {
            Pe.call(a.prototype, r) || (e[r] = t);
          }), e;
        })(), { chain: !1 }), a.VERSION = Z, h(["bind", "bindKey", "curry", "curryRight", "partial", "partialRight"], function(e) {
          a[e].placeholder = a;
        }), h(["drop", "take"], function(e, t) {
          K.prototype[e] = function(r) {
            r = r === c ? 1 : $e(ge(r), 0);
            var n = this.__filtered__ && !t ? new K(this) : this.clone();
            return n.__filtered__ ? n.__takeCount__ = Ye(r, n.__takeCount__) : n.__views__.push({ size: Ye(r, Dt), type: e + (n.__dir__ < 0 ? "Right" : "") }), n;
          }, K.prototype[e + "Right"] = function(r) {
            return this.reverse()[e](r).reverse();
          };
        }), h(["filter", "map", "takeWhile"], function(e, t) {
          var r = t + 1, n = r == ro || r == Cc;
          K.prototype[e] = function(i) {
            var u = this.clone();
            return u.__iteratees__.push({ iteratee: ue(i, 3), type: r }), u.__filtered__ = u.__filtered__ || n, u;
          };
        }), h(["head", "last"], function(e, t) {
          var r = "take" + (t ? "Right" : "");
          K.prototype[e] = function() {
            return this[r](1).value()[0];
          };
        }), h(["initial", "tail"], function(e, t) {
          var r = "drop" + (t ? "" : "Right");
          K.prototype[e] = function() {
            return this.__filtered__ ? new K(this) : this[r](1);
          };
        }), K.prototype.compact = function() {
          return this.filter(ct);
        }, K.prototype.find = function(e) {
          return this.filter(e).head();
        }, K.prototype.findLast = function(e) {
          return this.reverse().find(e);
        }, K.prototype.invokeMap = ve(function(e, t) {
          return typeof e == "function" ? new K(this) : this.map(function(r) {
            return Yr(r, e, t);
          });
        }), K.prototype.reject = function(e) {
          return this.filter(Wn(ue(e)));
        }, K.prototype.slice = function(e, t) {
          e = ge(e);
          var r = this;
          return r.__filtered__ && (e > 0 || t < 0) ? new K(r) : (e < 0 ? r = r.takeRight(-e) : e && (r = r.drop(e)), t !== c && (t = ge(t), r = t < 0 ? r.dropRight(-t) : r.take(t - e)), r);
        }, K.prototype.takeRightWhile = function(e) {
          return this.reverse().takeWhile(e).reverse();
        }, K.prototype.toArray = function() {
          return this.take(Dt);
        }, zt(K.prototype, function(e, t) {
          var r = /^(?:filter|find|map|reject)|While$/.test(t), n = /^(?:head|last)$/.test(t), i = a[n ? "take" + (t == "last" ? "Right" : "") : t], u = n || /^find/.test(t);
          i && (a.prototype[t] = function() {
            var m = this.__wrapped__, g = n ? [1] : arguments, A = m instanceof K, E = g[0], P = A || fe(m), D = function(be) {
              var we = i.apply(a, C([be], g));
              return n && W ? we[0] : we;
            };
            P && r && typeof E == "function" && E.length != 1 && (A = P = !1);
            var W = this.__chain__, Y = !!this.__actions__.length, re = u && !W, me = A && !Y;
            if (!u && P) {
              m = me ? m : new K(this);
              var ee = e.apply(m, g);
              return ee.__actions__.push({ func: jn, args: [D], thisArg: c }), new oe(ee, W);
            }
            return re && me ? e.apply(this, g) : (ee = this.thru(D), re ? n ? ee.value()[0] : ee.value() : ee);
          });
        }), h(["pop", "push", "shift", "sort", "splice", "unshift"], function(e) {
          var t = Jn[e], r = /^(?:push|sort|unshift)$/.test(e) ? "tap" : "thru", n = /^(?:pop|shift)$/.test(e);
          a.prototype[e] = function() {
            var i = arguments;
            if (n && !this.__chain__) {
              var u = this.value();
              return t.apply(fe(u) ? u : [], i);
            }
            return this[r](function(m) {
              return t.apply(fe(m) ? m : [], i);
            });
          };
        }), zt(K.prototype, function(e, t) {
          var r = a[t];
          if (r) {
            var n = r.name + "";
            Pe.call(zr, n) || (zr[n] = []), zr[n].push({ name: t, func: r });
          }
        }), zr[Rn(c, xr).name] = [{ name: "wrapper", func: c }], K.prototype.clone = st, K.prototype.reverse = Oa, K.prototype.value = Uu, a.prototype.at = Wm, a.prototype.chain = Xh, a.prototype.commit = Vh, a.prototype.next = Kh, a.prototype.plant = Zh, a.prototype.reverse = Yh, a.prototype.toJSON = a.prototype.valueOf = a.prototype.value = Qh, a.prototype.first = a.prototype.head, an && (a.prototype[an] = Jh), a;
      }, Pr = Ou();
      cr ? ((cr.exports = Pr)._ = Pr, za._ = Pr) : Ge._ = Pr;
    }).call(Gy);
  })(hn, hn.exports)), hn.exports;
}
var Ds = {}, Ol;
function Vy() {
  return Ol || (Ol = 1, (function(s) {
    s.aliasToReal = {
      // Lodash aliases.
      each: "forEach",
      eachRight: "forEachRight",
      entries: "toPairs",
      entriesIn: "toPairsIn",
      extend: "assignIn",
      extendAll: "assignInAll",
      extendAllWith: "assignInAllWith",
      extendWith: "assignInWith",
      first: "head",
      // Methods that are curried variants of others.
      conforms: "conformsTo",
      matches: "isMatch",
      property: "get",
      // Ramda aliases.
      __: "placeholder",
      F: "stubFalse",
      T: "stubTrue",
      all: "every",
      allPass: "overEvery",
      always: "constant",
      any: "some",
      anyPass: "overSome",
      apply: "spread",
      assoc: "set",
      assocPath: "set",
      complement: "negate",
      compose: "flowRight",
      contains: "includes",
      dissoc: "unset",
      dissocPath: "unset",
      dropLast: "dropRight",
      dropLastWhile: "dropRightWhile",
      equals: "isEqual",
      identical: "eq",
      indexBy: "keyBy",
      init: "initial",
      invertObj: "invert",
      juxt: "over",
      omitAll: "omit",
      nAry: "ary",
      path: "get",
      pathEq: "matchesProperty",
      pathOr: "getOr",
      paths: "at",
      pickAll: "pick",
      pipe: "flow",
      pluck: "map",
      prop: "get",
      propEq: "matchesProperty",
      propOr: "getOr",
      props: "at",
      symmetricDifference: "xor",
      symmetricDifferenceBy: "xorBy",
      symmetricDifferenceWith: "xorWith",
      takeLast: "takeRight",
      takeLastWhile: "takeRightWhile",
      unapply: "rest",
      unnest: "flatten",
      useWith: "overArgs",
      where: "conformsTo",
      whereEq: "isMatch",
      zipObj: "zipObject"
    }, s.aryMethod = {
      1: [
        "assignAll",
        "assignInAll",
        "attempt",
        "castArray",
        "ceil",
        "create",
        "curry",
        "curryRight",
        "defaultsAll",
        "defaultsDeepAll",
        "floor",
        "flow",
        "flowRight",
        "fromPairs",
        "invert",
        "iteratee",
        "memoize",
        "method",
        "mergeAll",
        "methodOf",
        "mixin",
        "nthArg",
        "over",
        "overEvery",
        "overSome",
        "rest",
        "reverse",
        "round",
        "runInContext",
        "spread",
        "template",
        "trim",
        "trimEnd",
        "trimStart",
        "uniqueId",
        "words",
        "zipAll"
      ],
      2: [
        "add",
        "after",
        "ary",
        "assign",
        "assignAllWith",
        "assignIn",
        "assignInAllWith",
        "at",
        "before",
        "bind",
        "bindAll",
        "bindKey",
        "chunk",
        "cloneDeepWith",
        "cloneWith",
        "concat",
        "conformsTo",
        "countBy",
        "curryN",
        "curryRightN",
        "debounce",
        "defaults",
        "defaultsDeep",
        "defaultTo",
        "delay",
        "difference",
        "divide",
        "drop",
        "dropRight",
        "dropRightWhile",
        "dropWhile",
        "endsWith",
        "eq",
        "every",
        "filter",
        "find",
        "findIndex",
        "findKey",
        "findLast",
        "findLastIndex",
        "findLastKey",
        "flatMap",
        "flatMapDeep",
        "flattenDepth",
        "forEach",
        "forEachRight",
        "forIn",
        "forInRight",
        "forOwn",
        "forOwnRight",
        "get",
        "groupBy",
        "gt",
        "gte",
        "has",
        "hasIn",
        "includes",
        "indexOf",
        "intersection",
        "invertBy",
        "invoke",
        "invokeMap",
        "isEqual",
        "isMatch",
        "join",
        "keyBy",
        "lastIndexOf",
        "lt",
        "lte",
        "map",
        "mapKeys",
        "mapValues",
        "matchesProperty",
        "maxBy",
        "meanBy",
        "merge",
        "mergeAllWith",
        "minBy",
        "multiply",
        "nth",
        "omit",
        "omitBy",
        "overArgs",
        "pad",
        "padEnd",
        "padStart",
        "parseInt",
        "partial",
        "partialRight",
        "partition",
        "pick",
        "pickBy",
        "propertyOf",
        "pull",
        "pullAll",
        "pullAt",
        "random",
        "range",
        "rangeRight",
        "rearg",
        "reject",
        "remove",
        "repeat",
        "restFrom",
        "result",
        "sampleSize",
        "some",
        "sortBy",
        "sortedIndex",
        "sortedIndexOf",
        "sortedLastIndex",
        "sortedLastIndexOf",
        "sortedUniqBy",
        "split",
        "spreadFrom",
        "startsWith",
        "subtract",
        "sumBy",
        "take",
        "takeRight",
        "takeRightWhile",
        "takeWhile",
        "tap",
        "throttle",
        "thru",
        "times",
        "trimChars",
        "trimCharsEnd",
        "trimCharsStart",
        "truncate",
        "union",
        "uniqBy",
        "uniqWith",
        "unset",
        "unzipWith",
        "without",
        "wrap",
        "xor",
        "zip",
        "zipObject",
        "zipObjectDeep"
      ],
      3: [
        "assignInWith",
        "assignWith",
        "clamp",
        "differenceBy",
        "differenceWith",
        "findFrom",
        "findIndexFrom",
        "findLastFrom",
        "findLastIndexFrom",
        "getOr",
        "includesFrom",
        "indexOfFrom",
        "inRange",
        "intersectionBy",
        "intersectionWith",
        "invokeArgs",
        "invokeArgsMap",
        "isEqualWith",
        "isMatchWith",
        "flatMapDepth",
        "lastIndexOfFrom",
        "mergeWith",
        "orderBy",
        "padChars",
        "padCharsEnd",
        "padCharsStart",
        "pullAllBy",
        "pullAllWith",
        "rangeStep",
        "rangeStepRight",
        "reduce",
        "reduceRight",
        "replace",
        "set",
        "slice",
        "sortedIndexBy",
        "sortedLastIndexBy",
        "transform",
        "unionBy",
        "unionWith",
        "update",
        "xorBy",
        "xorWith",
        "zipWith"
      ],
      4: [
        "fill",
        "setWith",
        "updateWith"
      ]
    }, s.aryRearg = {
      2: [1, 0],
      3: [2, 0, 1],
      4: [3, 2, 0, 1]
    }, s.iterateeAry = {
      dropRightWhile: 1,
      dropWhile: 1,
      every: 1,
      filter: 1,
      find: 1,
      findFrom: 1,
      findIndex: 1,
      findIndexFrom: 1,
      findKey: 1,
      findLast: 1,
      findLastFrom: 1,
      findLastIndex: 1,
      findLastIndexFrom: 1,
      findLastKey: 1,
      flatMap: 1,
      flatMapDeep: 1,
      flatMapDepth: 1,
      forEach: 1,
      forEachRight: 1,
      forIn: 1,
      forInRight: 1,
      forOwn: 1,
      forOwnRight: 1,
      map: 1,
      mapKeys: 1,
      mapValues: 1,
      partition: 1,
      reduce: 2,
      reduceRight: 2,
      reject: 1,
      remove: 1,
      some: 1,
      takeRightWhile: 1,
      takeWhile: 1,
      times: 1,
      transform: 2
    }, s.iterateeRearg = {
      mapKeys: [1],
      reduceRight: [1, 0]
    }, s.methodRearg = {
      assignInAllWith: [1, 0],
      assignInWith: [1, 2, 0],
      assignAllWith: [1, 0],
      assignWith: [1, 2, 0],
      differenceBy: [1, 2, 0],
      differenceWith: [1, 2, 0],
      getOr: [2, 1, 0],
      intersectionBy: [1, 2, 0],
      intersectionWith: [1, 2, 0],
      isEqualWith: [1, 2, 0],
      isMatchWith: [2, 1, 0],
      mergeAllWith: [1, 0],
      mergeWith: [1, 2, 0],
      padChars: [2, 1, 0],
      padCharsEnd: [2, 1, 0],
      padCharsStart: [2, 1, 0],
      pullAllBy: [2, 1, 0],
      pullAllWith: [2, 1, 0],
      rangeStep: [1, 2, 0],
      rangeStepRight: [1, 2, 0],
      setWith: [3, 1, 2, 0],
      sortedIndexBy: [2, 1, 0],
      sortedLastIndexBy: [2, 1, 0],
      unionBy: [1, 2, 0],
      unionWith: [1, 2, 0],
      updateWith: [3, 1, 2, 0],
      xorBy: [1, 2, 0],
      xorWith: [1, 2, 0],
      zipWith: [1, 2, 0]
    }, s.methodSpread = {
      assignAll: { start: 0 },
      assignAllWith: { start: 0 },
      assignInAll: { start: 0 },
      assignInAllWith: { start: 0 },
      defaultsAll: { start: 0 },
      defaultsDeepAll: { start: 0 },
      invokeArgs: { start: 2 },
      invokeArgsMap: { start: 2 },
      mergeAll: { start: 0 },
      mergeAllWith: { start: 0 },
      partial: { start: 1 },
      partialRight: { start: 1 },
      without: { start: 1 },
      zipAll: { start: 0 }
    }, s.mutate = {
      array: {
        fill: !0,
        pull: !0,
        pullAll: !0,
        pullAllBy: !0,
        pullAllWith: !0,
        pullAt: !0,
        remove: !0,
        reverse: !0
      },
      object: {
        assign: !0,
        assignAll: !0,
        assignAllWith: !0,
        assignIn: !0,
        assignInAll: !0,
        assignInAllWith: !0,
        assignInWith: !0,
        assignWith: !0,
        defaults: !0,
        defaultsAll: !0,
        defaultsDeep: !0,
        defaultsDeepAll: !0,
        merge: !0,
        mergeAll: !0,
        mergeAllWith: !0,
        mergeWith: !0
      },
      set: {
        set: !0,
        setWith: !0,
        unset: !0,
        update: !0,
        updateWith: !0
      }
    }, s.realToAlias = (function() {
      var l = Object.prototype.hasOwnProperty, d = s.aliasToReal, p = {};
      for (var h in d) {
        var f = d[h];
        l.call(p, f) ? p[f].push(h) : p[f] = [h];
      }
      return p;
    })(), s.remap = {
      assignAll: "assign",
      assignAllWith: "assignWith",
      assignInAll: "assignIn",
      assignInAllWith: "assignInWith",
      curryN: "curry",
      curryRightN: "curryRight",
      defaultsAll: "defaults",
      defaultsDeepAll: "defaultsDeep",
      findFrom: "find",
      findIndexFrom: "findIndex",
      findLastFrom: "findLast",
      findLastIndexFrom: "findLastIndex",
      getOr: "get",
      includesFrom: "includes",
      indexOfFrom: "indexOf",
      invokeArgs: "invoke",
      invokeArgsMap: "invokeMap",
      lastIndexOfFrom: "lastIndexOf",
      mergeAll: "merge",
      mergeAllWith: "mergeWith",
      padChars: "pad",
      padCharsEnd: "padEnd",
      padCharsStart: "padStart",
      propertyOf: "get",
      rangeStep: "range",
      rangeStepRight: "rangeRight",
      restFrom: "rest",
      spreadFrom: "spread",
      trimChars: "trim",
      trimCharsEnd: "trimEnd",
      trimCharsStart: "trimStart",
      zipAll: "zip"
    }, s.skipFixed = {
      castArray: !0,
      flow: !0,
      flowRight: !0,
      iteratee: !0,
      mixin: !0,
      rearg: !0,
      runInContext: !0
    }, s.skipRearg = {
      add: !0,
      assign: !0,
      assignIn: !0,
      bind: !0,
      bindKey: !0,
      concat: !0,
      difference: !0,
      divide: !0,
      eq: !0,
      gt: !0,
      gte: !0,
      isEqual: !0,
      lt: !0,
      lte: !0,
      matchesProperty: !0,
      merge: !0,
      multiply: !0,
      overArgs: !0,
      partial: !0,
      partialRight: !0,
      propertyOf: !0,
      random: !0,
      range: !0,
      rangeRight: !0,
      subtract: !0,
      zip: !0,
      zipObject: !0,
      zipObjectDeep: !0
    };
  })(Ds)), Ds;
}
var Rs, Ul;
function Ky() {
  return Ul || (Ul = 1, Rs = {}), Rs;
}
var zs, Bl;
function Jy() {
  if (Bl) return zs;
  Bl = 1;
  var s = Vy(), l = Ky(), d = Array.prototype.push;
  function p(b, C) {
    return C == 2 ? function(T, x) {
      return b.apply(void 0, arguments);
    } : function(T) {
      return b.apply(void 0, arguments);
    };
  }
  function h(b, C) {
    return C == 2 ? function(T, x) {
      return b(T, x);
    } : function(T) {
      return b(T);
    };
  }
  function f(b) {
    for (var C = b ? b.length : 0, T = Array(C); C--; )
      T[C] = b[C];
    return T;
  }
  function v(b) {
    return function(C) {
      return b({}, C);
    };
  }
  function w(b, C) {
    return function() {
      for (var T = arguments.length, x = T - 1, L = Array(T); T--; )
        L[T] = arguments[T];
      var G = L[C], H = L.slice(0, C);
      return G && d.apply(H, G), C != x && d.apply(H, L.slice(C + 1)), b.apply(this, H);
    };
  }
  function S(b, C) {
    return function() {
      var T = arguments.length;
      if (T) {
        for (var x = Array(T); T--; )
          x[T] = arguments[T];
        var L = x[0] = C.apply(void 0, x);
        return b.apply(void 0, x), L;
      }
    };
  }
  function N(b, C, T, x) {
    var L = typeof C == "function", G = C === Object(C);
    if (G && (x = T, T = C, C = void 0), T == null)
      throw new TypeError();
    x || (x = {});
    var H = {
      cap: "cap" in x ? x.cap : !0,
      curry: "curry" in x ? x.curry : !0,
      fixed: "fixed" in x ? x.fixed : !0,
      immutable: "immutable" in x ? x.immutable : !0,
      rearg: "rearg" in x ? x.rearg : !0
    }, U = L ? T : l, M = "curry" in x && x.curry, F = "fixed" in x && x.fixed, J = "rearg" in x && x.rearg, j = L ? T.runInContext() : void 0, se = L ? T : {
      ary: b.ary,
      assign: b.assign,
      clone: b.clone,
      curry: b.curry,
      forEach: b.forEach,
      isArray: b.isArray,
      isError: b.isError,
      isFunction: b.isFunction,
      isWeakMap: b.isWeakMap,
      iteratee: b.iteratee,
      keys: b.keys,
      rearg: b.rearg,
      toInteger: b.toInteger,
      toPath: b.toPath
    }, te = se.ary, de = se.assign, ne = se.clone, B = se.curry, z = se.forEach, $ = se.isArray, he = se.isError, Ae = se.isFunction, ye = se.isWeakMap, Ne = se.keys, Ce = se.rearg, Le = se.toInteger, ae = se.toPath, le = Ne(s.aryMethod), xe = {
      castArray: function(X) {
        return function() {
          var O = arguments[0];
          return $(O) ? X(f(O)) : X.apply(void 0, arguments);
        };
      },
      iteratee: function(X) {
        return function() {
          var O = arguments[0], q = arguments[1], I = X(O, q), c = I.length;
          return H.cap && typeof q == "number" ? (q = q > 2 ? q - 2 : 1, c && c <= q ? I : h(I, q)) : I;
        };
      },
      mixin: function(X) {
        return function(O) {
          var q = this;
          if (!Ae(q))
            return X(q, Object(O));
          var I = [];
          return z(Ne(O), function(c) {
            Ae(O[c]) && I.push([c, q.prototype[c]]);
          }), X(q, Object(O)), z(I, function(c) {
            var Z = c[1];
            Ae(Z) ? q.prototype[c[0]] = Z : delete q.prototype[c[0]];
          }), q;
        };
      },
      nthArg: function(X) {
        return function(O) {
          var q = O < 0 ? 1 : Le(O) + 1;
          return B(X(O), q);
        };
      },
      rearg: function(X) {
        return function(O, q) {
          var I = q ? q.length : 0;
          return B(X(O, q), I);
        };
      },
      runInContext: function(X) {
        return function(O) {
          return N(b, X(O), x);
        };
      }
    };
    function qe(X, O) {
      if (H.cap) {
        var q = s.iterateeRearg[X];
        if (q)
          return Je(O, q);
        var I = !L && s.iterateeAry[X];
        if (I)
          return rt(O, I);
      }
      return O;
    }
    function Ve(X, O, q) {
      return M || H.curry && q > 1 ? B(O, q) : O;
    }
    function ft(X, O, q) {
      if (H.fixed && (F || !s.skipFixed[X])) {
        var I = s.methodSpread[X], c = I && I.start;
        return c === void 0 ? te(O, q) : w(O, c);
      }
      return O;
    }
    function Mt(X, O, q) {
      return H.rearg && q > 1 && (J || !s.skipRearg[X]) ? Ce(O, s.methodRearg[X] || s.aryRearg[q]) : O;
    }
    function Te(X, O) {
      O = ae(O);
      for (var q = -1, I = O.length, c = I - 1, Z = ne(Object(X)), ce = Z; ce != null && ++q < I; ) {
        var Se = O[q], Q = ce[Se];
        Q != null && !(Ae(Q) || he(Q) || ye(Q)) && (ce[Se] = ne(q == c ? Q : Object(Q))), ce = ce[Se];
      }
      return Z;
    }
    function xt(X) {
      return pe.runInContext.convert(X)(void 0);
    }
    function Ke(X, O) {
      var q = s.aliasToReal[X] || X, I = s.remap[q] || q, c = x;
      return function(Z) {
        var ce = L ? j : se, Se = L ? j[I] : O, Q = de(de({}, c), Z);
        return N(ce, q, Se, Q);
      };
    }
    function rt(X, O) {
      return ie(X, function(q) {
        return typeof q == "function" ? h(q, O) : q;
      });
    }
    function Je(X, O) {
      return ie(X, function(q) {
        var I = O.length;
        return p(Ce(h(q, I), O), I);
      });
    }
    function ie(X, O) {
      return function() {
        var q = arguments.length;
        if (!q)
          return X();
        for (var I = Array(q); q--; )
          I[q] = arguments[q];
        var c = H.rearg ? 0 : q - 1;
        return I[c] = O(I[c]), X.apply(void 0, I);
      };
    }
    function Ie(X, O, q) {
      var I, c = s.aliasToReal[X] || X, Z = O, ce = xe[c];
      return ce ? Z = ce(O) : H.immutable && (s.mutate.array[c] ? Z = S(O, f) : s.mutate.object[c] ? Z = S(O, v(O)) : s.mutate.set[c] && (Z = S(O, Te))), z(le, function(Se) {
        return z(s.aryMethod[Se], function(Q) {
          if (c == Q) {
            var Ze = s.methodSpread[c], Fe = Ze && Ze.afterRearg;
            return I = Fe ? ft(c, Mt(c, Z, Se), Se) : Mt(c, ft(c, Z, Se), Se), I = qe(c, I), I = Ve(c, I, Se), !1;
          }
        }), !I;
      }), I || (I = Z), I == O && (I = M ? B(I, 1) : function() {
        return O.apply(this, arguments);
      }), I.convert = Ke(c, O), I.placeholder = O.placeholder = q, I;
    }
    if (!G)
      return Ie(C, T, U);
    var pe = T, _e = [];
    return z(le, function(X) {
      z(s.aryMethod[X], function(O) {
        var q = pe[s.remap[O] || O];
        q && _e.push([O, Ie(O, q, pe)]);
      });
    }), z(Ne(pe), function(X) {
      var O = pe[X];
      if (typeof O == "function") {
        for (var q = _e.length; q--; )
          if (_e[q][0] == X)
            return;
        O.convert = Ke(X, O), _e.push([X, O]);
      }
    }), z(_e, function(X) {
      pe[X[0]] = X[1];
    }), pe.convert = xt, pe.placeholder = pe, z(Ne(pe), function(X) {
      z(s.realToAlias[X] || [], function(O) {
        pe[O] = pe[X];
      });
    }), pe;
  }
  return zs = N, zs;
}
var Ls, Fl;
function Zy() {
  if (Fl) return Ls;
  Fl = 1;
  var s = Xy().runInContext();
  return Ls = Jy()(s, s), Ls;
}
var Yy = Zy();
const Qy = (s, l) => {
  switch (l.type) {
    case "SET_TOOLCALLS":
      return {
        ...s,
        toolcalls: l.payload
      };
    case "CHANGE_TEXTAREA_INPUT": {
      const { index: d, arg: p } = l.payload;
      return {
        ...s,
        toolcalls: s.toolcalls?.map((h, f) => f === d ? { ...h, arguments: p } : h)
      };
    }
    case "CHANGE_ARG_INPUT": {
      const { index: d, field: p, value: h } = l.payload, f = p.replace(/^\/+/, "").replace(/\//g, "."), v = h === "null" ? null : h;
      return {
        ...s,
        toolcalls: s.toolcalls?.map(
          (w, S) => S === d ? {
            ...w,
            arguments: {
              ...w.arguments,
              ...Yy.set(f, v, w.arguments)
            }
          } : w
        )
      };
    }
    case "DELETE_PLAN": {
      const { rowIndex: d } = l.payload;
      return {
        ...s,
        toolcalls: [
          ...s.toolcalls.slice(0, d),
          ...s.toolcalls.slice(d + 1)
        ]
      };
    }
    default:
      throw new Error("Unhandled toolcalls action type");
  }
}, z1 = (s) => {
  const l = {
    toolcalls: []
  }, [{ toolcalls: d }, p] = Gg(Qy, l), h = tt([]), f = tt([]), [v, w] = R(!1), [S, N] = R(null), b = tt(null), [C, T] = R(!0), { plan: x, setPlan: L } = dt(), G = !1;
  Ee(() => {
    console.log("toolcall useeffect", x, JSON.stringify(x, null, 2)), x?.planned_toolcalls && (p({ type: "SET_TOOLCALLS", payload: x.planned_toolcalls }), h.current = x.executed_toolcalls || [], f.current = x.planned_toolcalls || []);
  }, []), Ee(() => {
    console.log(
      "toolcall changed",
      JSON.stringify(d),
      f.current
    ), d && w(d.length <= 1), L({
      executed_toolcalls: h.current,
      planned_toolcalls: d
    });
  }, [d]), Xg(() => {
    const ne = b.current;
    ne && ne.setSelectionRange(S, S);
  }, [b.current?.value]);
  const H = (ne, B, z) => {
    console.log("handleArgsInputChange", ne, B, z), p({ type: "CHANGE_ARG_INPUT", payload: { index: ne, field: B, value: z } });
  }, U = (ne, B) => {
    const z = pn.load(B);
    console.log("handleTextAreaChange", z), p({ type: "CHANGE_TEXTAREA_INPUT", payload: { index: ne, arg: z } });
  }, M = () => {
    console.log("Cancel plan ", JSON.stringify(f.current)), p({ type: "SET_TOOLCALLS", payload: f.current }), L({
      executed_toolcalls: h.current,
      planned_toolcalls: f.current
    }), s.setIsEditPage(!1);
  }, F = () => {
    console.log("handleSave ", JSON.stringify(x?.planned_toolcalls)), x?.planned_toolcalls && (p({ type: "SET_TOOLCALLS", payload: x.planned_toolcalls }), h.current = x.executed_toolcalls || [], f.current = x.planned_toolcalls || []), s.setIsEditPage(!1);
  }, J = (ne) => {
    console.log("deletePlanItem", ne), p({ type: "DELETE_PLAN", payload: { rowIndex: ne } });
  }, j = Ks({
    "edit-plan-settings-container bx--grid": !0
    // 'modal-dark-mode': props.isDarkTheme,
  }), se = () => {
    let ne = !1, B = !1;
    const z = x?.planned_toolcalls || [];
    for (let $ of z) {
      const he = $?.information_items || [], Ae = f.current?.find(
        (ye) => ye.name === $.name
      );
      for (let ye of he) {
        const Ne = ye.input_field.replace(/^\/+/, "").replace(/\//g, "."), Ce = yr.get($.arguments, Ne, ""), Le = yr.get(Ae?.arguments, Ne, "");
        ye.required === !0 && Ce === "" ? ne = !0 : Ce !== Le && (B = !0);
      }
    }
    return ne || !B;
  }, te = (ne) => {
    const z = ne.split(`
`).length;
    return z < 30 ? z : 30;
  }, de = s.frontendClientType === "vscode" ? "g90" : "g100";
  return /* @__PURE__ */ o(cv, { theme: s.isDarkTheme ? de : "g10", children: /* @__PURE__ */ _("div", { className: j, children: [
    /* @__PURE__ */ o("div", { className: "modal-overlay" }),
    /* @__PURE__ */ _("div", { className: "edit-plan-settings-inner", children: [
      /* @__PURE__ */ _("div", { className: "edit-plan-settings-header", children: [
        /* @__PURE__ */ o("h4", { children: "Edit plan" }),
        G,
        /* @__PURE__ */ o(
          pa,
          {
            onClick: M,
            label: "Close",
            align: "bottom",
            children: /* @__PURE__ */ o(ec, {})
          }
        )
      ] }),
      /* @__PURE__ */ o(
        Zt,
        {
          className: "warning-notification",
          "aria-label": "closes notification",
          kind: "warning",
          statusIconDescription: "notification",
          subtitle: "It's recommended to use the chat to update the plan. Changing some defaults might cause an error.",
          title: "Warning",
          hideCloseButton: !0,
          lowContrast: !0
        }
      ),
      /* @__PURE__ */ _("div", { className: "edit-plan-settings-body", children: [
        x?.planned_toolcalls?.length === 0 && "No Plan",
        /* @__PURE__ */ o("div", { className: "rowParent", children: x?.planned_toolcalls?.map(
          (ne, B) => /* @__PURE__ */ o(Ht, { children: C ? /* @__PURE__ */ _("div", { className: "rowDiv", children: [
            /* @__PURE__ */ o("div", { className: "deleteColumn", children: /* @__PURE__ */ o(
              pa,
              {
                kind: "tertiary",
                size: "sm",
                label: "Delete",
                className: "deleteIcon",
                disabled: v,
                children: /* @__PURE__ */ o(
                  Hv,
                  {
                    fill: "#FF8389",
                    "aria-label": "Delete item",
                    onClick: (z) => {
                      z.stopPropagation(), J(B);
                    }
                  }
                )
              }
            ) }),
            /* @__PURE__ */ o("div", { className: "fieldColumn", children: /* @__PURE__ */ _(Ws, { children: [
              /* @__PURE__ */ o(
                Ct,
                {
                  legendText: B + 1 + ". " + ne.name,
                  messageText: `${B}`,
                  children: /* @__PURE__ */ o("div", { className: "formBackground", children: ne?.information_items?.map(
                    (z, $) => {
                      const he = z.input_field.replace(/^\/+/, "").replace(/\//g, "."), Ae = yr.get(
                        ne.arguments,
                        he,
                        ""
                      );
                      let ye;
                      Ae == null ? ye = "" : typeof Ae == "string" || typeof Ae == "number" ? ye = Ae : ye = String(Ae);
                      function Ne(Ce) {
                        let Le = Ce.label;
                        yr.endsWith(Le, "/") && (Le = yr.trimEnd(Le, "/"));
                        const ae = yr.split(Le, "/");
                        return `${yr.last(ae)} ${Ce.required ? "" : "(optional)"}`;
                      }
                      return /* @__PURE__ */ o(
                        _t,
                        {
                          ref: b,
                          id: z.label,
                          labelText: Ne(z),
                          value: ye,
                          size: "sm",
                          onChange: (Ce) => {
                            N(Ce.target.selectionStart), H(
                              B,
                              z.input_field,
                              Ce.target.value
                            );
                          }
                        },
                        B + "_" + $
                      );
                    }
                  ) })
                }
              ),
              /* @__PURE__ */ o("hr", {})
            ] }) })
          ] }) : /* @__PURE__ */ o("div", { className: "rowDiv", children: /* @__PURE__ */ o(
            Gs,
            {
              ref: b,
              className: "textAreaClass",
              labelText: B + 1 + ". " + ne.name,
              value: pn.dump(ne.arguments),
              rows: te(
                pn.dump(ne.arguments)
              ),
              onChange: (z) => {
                z.preventDefault(), N(z.target.selectionEnd), U(B, z.target.value);
              }
            }
          ) }) })
        ) })
      ] }),
      /* @__PURE__ */ _("div", { className: "edit-plan-settings-actions", children: [
        /* @__PURE__ */ o(
          Re,
          {
            kind: "secondary",
            onClick: M,
            children: "Cancel"
          }
        ),
        /* @__PURE__ */ o(
          Re,
          {
            kind: "primary",
            type: "submit",
            onClick: F,
            disabled: se(),
            children: "Save"
          }
        )
      ] })
    ] })
  ] }) });
}, eb = ({
  currentWord: s,
  getNewInput: l,
  menuRef: d,
  onInputChange: p,
  setShowFileMenu: h,
  showFileMenu: f,
  isNavigating: v,
  fileProvider: w
}) => {
  const { setSelectedFiles: S } = dt(), { inputRef: N } = va(), [b, C] = R([]), [T, x] = R(b), [L, G] = R(!1), H = tt(null), U = tt(!1), M = tt([]);
  Ee(() => {
    f && v && M.current[0]?.focus();
  }, [f, v]), Ee(() => {
    const j = async (se) => {
      const te = se.data;
      te.type === "fetchFiles-success" && C(te.value);
    };
    return window.addEventListener("message", j), () => {
      window.removeEventListener("message", j);
    };
  }, []);
  const F = (j) => {
    const te = j.slice(1).replace(/(^['"]|['"]$)/g, "").toLowerCase();
    return b.filter((ne) => ne.path.toLowerCase().includes(te));
  };
  Ee(() => {
    let j = !0;
    return (async () => {
      if (s.startsWith("@") && !U.current)
        try {
          const te = await w.getFileList();
          j && (C(te), U.current = !0);
        } catch (te) {
          console.error("Failed to fetch files:", te);
        }
    })(), s.startsWith("@") && (G(!0), H.current && clearTimeout(H.current), H.current = window.setTimeout(() => {
      G(!1), b.length === 0 && w.notifyNoFilesError ? w.notifyNoFilesError(
        "No files found in workspace. Please select a new workspace by going to File > Open Folder."
      ) : x(F(s));
    }, 1500)), () => {
      j = !1, H.current && clearTimeout(H.current);
    };
  }, [s, b]), Ee(() => {
    f || (U.current = !1);
  }, [f]);
  async function J(j) {
    h(!1);
    const [se, ...te] = j.path.split("/"), ne = `@'${te.join("/")}'`, B = l(ne);
    if (p(B), S((z) => z.map((he) => he.path).includes(j.path) ? z : [...z, j]), w.saveSelectedFilePath)
      try {
        await w.saveSelectedFilePath(j);
      } catch (z) {
        console.error("Failed to save file path:", z);
      }
    N.current?.focus();
  }
  return f ? /* @__PURE__ */ _(
    "div",
    {
      className: "file-menu",
      ref: d,
      children: [
        /* @__PURE__ */ _("div", { className: "file-menu-total", children: [
          L && /* @__PURE__ */ o(uv, { iconDescription: "Loading data..." }),
          /* @__PURE__ */ _("span", { children: [
            T.length,
            " ",
            T.length === 1 ? "file" : "files",
            " ",
            "found"
          ] })
        ] }),
        T.map((j, se) => /* @__PURE__ */ _(
          "div",
          {
            className: "file-menu-items",
            "aria-label": j.path,
            ref: (te) => {
              M.current[se] = te;
            },
            onClick: () => J(j),
            onKeyDown: (te) => {
              if (te.key === "Enter" || te.key === " ")
                J(j);
              else if (te.key === "ArrowDown") {
                te.preventDefault();
                const de = M.current[se + 1];
                de && de.focus();
              } else if (te.key === "ArrowUp") {
                te.preventDefault();
                const de = M.current[se - 1];
                de && de.focus();
              } else
                h(!1), N.current?.focus();
            },
            role: "menuitem",
            tabIndex: 0,
            children: [
              /* @__PURE__ */ o("div", { className: "file-menu-name", children: j.name }),
              /* @__PURE__ */ _("div", { className: "file-menu-path", children: [
                j.path,
                " "
              ] })
            ]
          },
          j.path
        ))
      ]
    }
  ) : null;
}, tb = ({
  commands: s,
  input: l,
  menuRef: d,
  onInputChange: p,
  showCommandOrParameterMenu: h,
  isNavigating: f,
  setIsNavigatingMenu: v
}) => {
  const [w, S] = R([]), [N, b] = R([]), [C, T] = R([]), [x, L] = R(null), [G, H] = R({
    showCommandMenu: !1,
    showParameterMenu: !1,
    showErrorMenu: !1
  }), { inputRef: U } = va(), M = tt(l), F = tt([]), J = tt([]);
  Ee(() => {
    G.showCommandMenu && f && requestAnimationFrame(() => {
      F.current[0]?.focus();
    });
  }, [N, G.showCommandMenu, f]), Ee(() => {
    G.showParameterMenu && f && requestAnimationFrame(() => {
      J.current[0]?.focus();
    });
  }, [C, G.showParameterMenu, f]), Ee(() => {
    const B = te(s);
    S(B), G.showCommandMenu && l.startsWith("/") && b(B);
  }, [s]), Ee(() => {
    const B = /^\/\s+$/, z = w.some(
      ($) => l.toLowerCase().includes($.name.toLowerCase())
    );
    if (M.current !== l) {
      if (M.current = l, l.length === 0 || B.test(l)) {
        L(null), H(($) => ({
          ...$,
          showCommandMenu: !1,
          showParameterMenu: !1
        }));
        return;
      }
      if (l.startsWith("/") && w.length === 0) {
        H(($) => ({
          ...$,
          showCommandMenu: !0,
          showParameterMenu: !1,
          showErrorMenu: !1
        }));
        return;
      }
      if (l.startsWith("/") && !z) {
        L(null), H(($) => ({
          ...$,
          showCommandMenu: !0,
          showParameterMenu: !1,
          showErrorMenu: !1
        })), de();
        return;
      }
      if (z && x) {
        H(($) => ({
          ...$,
          showCommandMenu: !1,
          showParameterMenu: !0
        })), ne();
        return;
      }
      if (l.startsWith("/") && l.length === 1) {
        H(($) => ({
          ...$,
          showCommandMenu: !0,
          showParameterMenu: !1,
          showErrorMenu: !1
        })), b(w);
        return;
      }
      G.showCommandMenu && de();
    }
  }, [l, w, x, G]);
  const j = (B) => {
    p(B.name), L(B), T(B.arguments), H((z) => ({
      ...z,
      showCommandMenu: !1,
      showParameterMenu: !0
    })), U.current?.focus(), v(!1);
  }, se = (B) => {
    if (x) {
      let z = `${l.trim()} ${B.name}:`;
      B.type === "file" && (z += " "), p(z), T(
        C.filter(
          ($) => !$.name.toLowerCase().includes(B.name)
        )
      );
    }
    U.current?.focus(), v(!1);
  };
  function te(B) {
    return Array.isArray(B) ? (B.sort((z, $) => z.name.localeCompare($.name)), B.map((z) => ({
      name: `/${z.name}`,
      arguments: z.parameters,
      description: `${z.description}`
    }))) : [];
  }
  function de() {
    const B = l.split(" ")[0].slice(1).toLowerCase();
    b(
      w.filter((z) => z.name.toLowerCase().includes(B))
    );
  }
  function ne() {
    if (x) {
      const B = x.arguments.filter(
        (z) => !l.toLowerCase().includes(`${z.name.toLowerCase()}:`)
      );
      T(B);
    }
  }
  return h ? /* @__PURE__ */ _(Ht, { children: [
    G.showErrorMenu && /* @__PURE__ */ o(
      "div",
      {
        className: "commands-menu",
        ref: d,
        children: /* @__PURE__ */ o("div", { className: "commands-menu-items", children: /* @__PURE__ */ o("p", { className: "description", children: "Commands are not available. Please wait or try again later." }) })
      }
    ),
    G.showCommandMenu && /* @__PURE__ */ o(
      "div",
      {
        className: "commands-menu",
        ref: d,
        children: N.length === 0 ? /* @__PURE__ */ o("div", { className: "commands-menu-items", children: /* @__PURE__ */ o("p", { className: "description", children: "Loading commands..." }) }) : N.map((B, z) => /* @__PURE__ */ _(
          "div",
          {
            className: "commands-menu-items",
            "aria-label": B.name,
            ref: ($) => {
              F.current[z] = $;
            },
            onClick: () => j(B),
            onKeyDown: ($) => {
              if ($.key === "Enter" || $.key === " ")
                j(B);
              else if ($.key === "ArrowDown") {
                $.preventDefault();
                const he = F.current[z + 1];
                he && he.focus();
              } else if ($.key === "ArrowUp") {
                $.preventDefault();
                const he = F.current[z - 1];
                he && he.focus();
              } else $.key === "Escape" && (H((he) => ({
                ...he,
                showCommandMenu: !1,
                showParameterMenu: !1,
                showErrorMenu: !1
              })), U.current?.focus());
            },
            role: "menuitem",
            tabIndex: 0,
            children: [
              B.name,
              /* @__PURE__ */ o("p", { className: "description", children: B.description })
            ]
          },
          B.name
        ))
      }
    ),
    G.showParameterMenu && /* @__PURE__ */ o(
      "div",
      {
        className: "parameter-menu",
        ref: d,
        children: C.map((B, z) => /* @__PURE__ */ _(
          "div",
          {
            className: "parameter-menu-items",
            "aria-label": B.name,
            ref: ($) => {
              F.current[z] = $;
            },
            onClick: () => se(B),
            onKeyDown: ($) => {
              if ($.key === "Enter" || $.key === " ")
                se(B);
              else if ($.key === "ArrowDown") {
                $.preventDefault();
                const he = J.current[z + 1];
                he && he.focus();
              } else if ($.key === "ArrowUp") {
                $.preventDefault();
                const he = J.current[z - 1];
                he && he.focus();
              } else $.key === "Escape" && (H((he) => ({
                ...he,
                showCommandMenu: !1,
                showParameterMenu: !1,
                showErrorMenu: !1
              })), U.current?.focus());
            },
            role: "menuitem",
            tabIndex: 0,
            children: [
              B.required ? /* @__PURE__ */ o(
                Tl,
                {
                  size: "sm",
                  type: "blue",
                  children: "Required"
                }
              ) : /* @__PURE__ */ o(
                Tl,
                {
                  size: "sm",
                  type: "gray",
                  children: "Optional"
                }
              ),
              B.name,
              ":"
            ]
          },
          B.name
        ))
      }
    )
  ] }) : null;
}, L1 = ({
  commands: s,
  fetching: l,
  onSendMessage: d,
  fileProvider: p,
  fileInputRef: h,
  onInputChange: f,
  value: v,
  handleAddImages: w,
  isUploadingFiles: S = !1
}) => {
  const { setSelectedFiles: N, showPorgSelection: b } = dt(), [C, T] = R(v ?? ""), [x, L] = R(""), [G, H] = R(!1), [U, M] = R(!1), [F, J] = R(0), [j, se] = R(""), [te, de] = R(!1), ne = tt(null), B = tt(null), { registerInputHandler: z, inputRef: $ } = va(), he = tt(null), [Ae, ye] = R(0), [Ne, Ce] = R([]), Le = (ie) => {
    $.current = ie, he.current = ie;
  }, [ae, le] = R(!1);
  Ee(() => {
    v !== void 0 && (T(v), v.startsWith("/") ? M(!0) : M(!1));
  }, [v]), Ee(() => {
    $.current?.focus(), z(T);
  }, []), Ee(() => {
    if (!he.current) return;
    const ie = new ResizeObserver(() => {
      if (he.current) {
        he.current.style.height = "auto";
        const Ie = he.current.scrollHeight;
        he.current.style.height = `${Ie}px`;
      }
    });
    return ie.observe(he.current), () => ie.disconnect();
  }, []), Ee(() => {
    l || $.current?.focus();
  }, [l]), Ee(() => {
    const ie = (Ie) => {
      const pe = B.current;
      pe && !pe.contains(Ie.target) && (H(!1), M(!1), le(!1));
    };
    return document.addEventListener("mousedown", ie), () => document.removeEventListener("mousedown", ie);
  }, [B]);
  const xe = (ie, Ie, pe) => {
    const _e = ie.lastIndexOf(" ", Ie - 1), X = ie.indexOf(" ", pe), O = _e < 0 ? 0 : _e + 1, q = X < 0 ? ie.length : X, I = ie.substring(O, q);
    return J(O), se(I), I;
  }, qe = (ie) => {
    const Ie = ie.target, pe = ie.target.value;
    pe.length === 0 ? (Ie.style.height = "auto", Ie.style.height = `${Ie.scrollHeight}px`, N([])) : (Ie.style.height = he.current?.style.height ?? "auto", Ie.style.height = `${Ie.scrollHeight}px`), T(pe), f && f(pe);
    let _e = ie.target.selectionStart, X = ie.target.selectionEnd, O = xe(
      pe,
      _e ?? -1,
      X ?? -1
    );
    L(O);
    const q = pe.charAt(_e - 1);
    !h && q === "@" && !te ? (de(!0), O.startsWith("@") && H(!0)) : q !== "@" && de(!1), O.startsWith("@") || H(!1), pe.startsWith("/") ? M(!0) : M(!1);
  }, Ve = (ie) => {
    ie.key === "Escape" && (H(!1), M(!1), le(!1)), Je(ie);
  }, ft = (ie) => C.slice(0, F) + ie + C.slice(F + j.length) + " ", Mt = (ie) => {
    T(ie), f && f(ie), L(""), se("");
  }, Te = (ie) => {
    if (w) {
      const Ie = new DataTransfer();
      ie.forEach((_e) => Ie.items.add(_e));
      const pe = document.getElementById(
        "image-upload-input"
      );
      pe && (Object.defineProperty(pe, "files", {
        value: Ie.files,
        writable: !1,
        configurable: !0
      }), w({
        target: pe,
        currentTarget: pe
      }));
    }
  }, xt = (ie) => {
    const Ie = ie.target.files;
    if (Ie) {
      const pe = Array.from(Ie);
      Ce((_e) => {
        const X = [..._e, ...pe];
        return Te(X), X;
      }), ie.target.value = "";
    }
  }, Ke = (ie) => {
    Ce((pe) => {
      const _e = pe.filter((X, O) => O !== ie);
      return Te(_e), _e;
    });
    const Ie = document.getElementById(
      "image-upload-input"
    );
    Ie && (Ie.value = "");
  }, rt = () => {
    if (S) {
      console.log("Files are still uploading, please wait...");
      return;
    }
    C.trim() !== "" && (d(C), T(""), ne.current?.blur(), ye((ie) => ie + 1), Ce([]));
  }, Je = (ie) => {
    le(!1), ie.key === "Enter" && !ie.shiftKey && (ie.preventDefault(), rt()), (ie.key === "ArrowUp" || ie.key === "ArrowDown") && le(!0);
  };
  return /* @__PURE__ */ _("div", { className: "prompt-input-container", children: [
    /* @__PURE__ */ o(
      Gs,
      {
        id: "prompt-input",
        labelText: "",
        placeholder: `How can I help you?

💡 Pro Tip: The more specific you are, the better I can help!
Use @ to add files, use / to list commands`,
        disabled: l || b,
        value: C,
        onChange: qe,
        onKeyDown: Ve,
        ref: Le
      }
    ),
    /* @__PURE__ */ _("div", { className: "prompt-actions", children: [
      /* @__PURE__ */ o(
        Re,
        {
          hasIconOnly: !0,
          kind: "ghost",
          className: C.trim() === "" || S ? "sendButton sendButton-disabled" : "sendButton",
          onClick: C.trim() !== "" && !S ? () => rt() : void 0,
          iconDescription: S ? "Uploading files..." : "Send",
          disabled: S,
          ref: ne,
          children: C.trim() === "" || S ? /* @__PURE__ */ o(Mv, { size: "24" }) : /* @__PURE__ */ o(Dv, { size: "24" })
        }
      ),
      w && /* @__PURE__ */ _("div", { className: "file-uploader-icon-wrapper", children: [
        /* @__PURE__ */ o(
          "input",
          {
            type: "file",
            accept: ".jpg,.png",
            multiple: !0,
            onChange: xt,
            style: { display: "none" },
            id: "image-upload-input"
          },
          Ae
        ),
        /* @__PURE__ */ o(
          Re,
          {
            kind: "primary",
            size: "sm",
            hasIconOnly: !0,
            iconDescription: "Add image",
            onClick: () => document.getElementById("image-upload-input")?.click(),
            className: "file-upload-button",
            children: /* @__PURE__ */ o(Rv, { size: 20 })
          }
        )
      ] })
    ] }),
    Ne.length > 0 && /* @__PURE__ */ o("div", { className: "uploaded-files-list", children: Ne.map((ie, Ie) => /* @__PURE__ */ _(
      "div",
      {
        className: "uploaded-file-item",
        children: [
          /* @__PURE__ */ o("span", { className: "file-name", children: ie.name }),
          /* @__PURE__ */ o(
            Re,
            {
              kind: "ghost",
              size: "sm",
              hasIconOnly: !0,
              iconDescription: "Remove file",
              onClick: () => Ke(Ie),
              className: "remove-file-button",
              children: /* @__PURE__ */ o(zv, { size: 16 })
            }
          )
        ]
      },
      Ie
    )) }),
    /* @__PURE__ */ _("div", { className: "prompt-menus", children: [
      /* @__PURE__ */ o(
        tb,
        {
          commands: s,
          input: C,
          menuRef: B,
          onInputChange: T,
          showCommandOrParameterMenu: U,
          isNavigating: ae,
          setIsNavigatingMenu: le
        }
      ),
      !h && /* @__PURE__ */ o(
        eb,
        {
          currentWord: x,
          getNewInput: ft,
          menuRef: B,
          onInputChange: Mt,
          setShowFileMenu: H,
          showFileMenu: G,
          isNavigating: ae,
          fileProvider: p
        }
      )
    ] })
  ] });
}, rb = "https://www.ibm.com/docs/en/SSMNED_12.1.x_cd/com.ibm.apic.assistant.doc/configure_apiagent_apimgmt.html", nb = "https://www.ibm.com/docs/SSCL05_preview/com.ibm.apic.assistant.doc/configure_apiagent_apimgmt.html", ha = "https://www.ibm.com/docs/en/SSMNED_12.1.x_cd/com.ibm.apic.assistant.doc/getting_started.html", $s = "https://www.ibm.com/docs/SSCL05_preview/com.ibm.apic.assistant.doc/getting_started.html", dc = "You are not part of any provider organizations which have API Agent enabled, or you do not have permission to use API Agent in any provider organization which have API Agent enabled in API Manager. Please contact your admin to enable.", ab = "Unable to fetch provider organizations. This might be due to network issue or the Agent not being enabled. Please refresh the chat, and contact your administrator if the issue continues.", qs = [
  { id: "en", label: "English" },
  // {id: 'es', label: 'Español'},
  // {id: 'de', label: 'Deutsch'},
  { id: "fr", label: "Français" },
  { id: "ja", label: "日本語" },
  // {id: 'pt-BR', label: 'Português (Brasil)'},
  // {id: 'zh', label: '中文'},
  { id: "ar", label: "العربية" }
], sb = {
  en: "en-US",
  // es: 'es',
  // de: 'de',
  fr: "fr-CA",
  // 'pt-BR': 'pt-BR',
  ja: "ja-JP",
  ar: "ar-SA"
  // zh: 'zh',
}, ob = qs.reduce(
  (s, l) => (s[l.id] = l.label, s),
  {}
);
function O1({
  label: s = "ARIA Agent",
  onClickCallback: l,
  isDarkTheme: d,
  platformAPI: p,
  frontendClientType: h = "vscode",
  // used to determine whether to show switch org or not
  hideToolbarMenu: f = !1,
  showCustomHeaderMenuItem: v = !1,
  showSidebarButton: w = !1,
  sidebarOpen: S = !1,
  dropdownButtons: N = [],
  rightButtons: b = []
}) {
  const { t: C, i18n: T } = vn(), { auth: x, apicTokenExpirationDate: L } = dt(), { isPorgError: G, porg: H, hidePorg: U } = Ar(), M = T.language, F = ob[M] || M;
  async function J() {
    p.logout && await p.logout();
  }
  async function j(de) {
    l(de);
  }
  let se = /* @__PURE__ */ _("div", { children: [
    /* @__PURE__ */ o("p", { className: "secondary pb-1rem", children: C("toolbar.aiExplained") }),
    /* @__PURE__ */ o("h3", { children: C("toolbar.aiAgent") }),
    /* @__PURE__ */ o("p", { className: "secondary pt-1rem pb-1rem", children: C("toolbar.accelerateDevelopment") }),
    /* @__PURE__ */ o("hr", {}),
    /* @__PURE__ */ o("p", { className: "secondary pt-1rem", children: C("toolbar.howItWorks") }),
    /* @__PURE__ */ o("p", { children: C("toolbar.aiCanAssist") }),
    /* @__PURE__ */ _("p", { className: "pt-1rem", children: [
      "1. ",
      /* @__PURE__ */ o("span", { className: "bold", children: C("toolbar.analyze") }),
      " ",
      " ",
      C("toolbar.analyzeDescription")
    ] }),
    /* @__PURE__ */ _("p", { className: "pb-1rem", children: [
      "2. ",
      /* @__PURE__ */ o("span", { className: "bold", children: C("toolbar.recommend") }),
      " ",
      " ",
      C("toolbar.recommendDescription")
    ] }),
    /* @__PURE__ */ o("hr", {}),
    /* @__PURE__ */ o("p", { className: "secondary pt-1rem", children: C("toolbar.baseAiModels") }),
    /* @__PURE__ */ _(
      "a",
      {
        href: "https://huggingface.co/ibm-granite",
        target: "_blank",
        rel: "noreferrer",
        children: [
          "Granite",
          " ",
          /* @__PURE__ */ o(Nl, {})
        ]
      }
    ),
    /* @__PURE__ */ o("p", { className: "secondary pt-1rem", children: C("toolbar.additionalModels") }),
    /* @__PURE__ */ _(
      "a",
      {
        href: "https://huggingface.co/meta-llama/Llama-4-Maverick-17B-128E-Instruct-FP8",
        target: "_blank",
        rel: "noreferrer",
        children: [
          "Llama 4 Maverick",
          " ",
          /* @__PURE__ */ o(Nl, {})
        ]
      }
    ),
    /* @__PURE__ */ o("p", { className: "secondary pt-1rem", children: C("toolbar.additionalDetails") }),
    /* @__PURE__ */ o("p", { children: C("toolbar.baseModelDescription") })
  ] });
  return /* @__PURE__ */ o("div", { className: "toolbar-container", children: /* @__PURE__ */ _(dv, { "aria-label": "toolbar", children: [
    /* @__PURE__ */ _("div", { className: "toolbar-sub-item", children: [
      !f && /* @__PURE__ */ _(
        $l,
        {
          align: "right",
          renderIcon: () => /* @__PURE__ */ o(Uv, {}),
          className: "agent-ui-overflow-menu",
          menuOptionsClass: `menu-items ${d ? `cds--${h === "vscode" ? "g90" : "g100"}` : "cds--white"}`,
          children: [
            /* @__PURE__ */ o(
              Ot,
              {
                className: "agent-ui-menu-item",
                itemText: /* @__PURE__ */ o("div", { children: C("toolbar.backToChats") }),
                "aria-label": "back to chats",
                onClick: () => j("backToLanding"),
                closeMenu: () => {
                }
              }
            ),
            /* @__PURE__ */ o(
              Ot,
              {
                className: "agent-ui-menu-item",
                itemText: /* @__PURE__ */ o("div", { children: C("toolbar.samplePrompts") }),
                "aria-label": "sample prompts",
                onClick: () => j("samplePrompts"),
                closeMenu: () => {
                }
              }
            ),
            /* @__PURE__ */ o(
              Ot,
              {
                className: "agent-ui-menu-item",
                itemText: /* @__PURE__ */ _("div", { className: "menu-sub-item", children: [
                  C("toolbar.newChat"),
                  /* @__PURE__ */ o(Lv, { className: "menuIcon" })
                ] }),
                "aria-label": "new chat",
                hasDivider: !0,
                disabled: G,
                onClick: () => j("newchat"),
                closeMenu: () => {
                }
              }
            ),
            h !== "apim" && h !== "apistudio-embedded" && /* @__PURE__ */ o(
              Ot,
              {
                className: "agent-ui-menu-item",
                itemText: /* @__PURE__ */ o("div", { children: C("toolbar.switchOrganization") }),
                "aria-label": "switch org",
                hasDivider: !0,
                disabled: G,
                onClick: () => j("switchorg"),
                closeMenu: () => {
                }
              }
            ),
            v && /* @__PURE__ */ o(
              Ot,
              {
                className: "agent-ui-menu-item",
                itemText: /* @__PURE__ */ o("div", { children: C("toolbar.updateHttpHeaders") }),
                "aria-label": "update headers",
                onClick: () => j("updateHeaders"),
                closeMenu: () => {
                }
              }
            ),
            p.logout && /* @__PURE__ */ o(
              Ot,
              {
                className: "agent-ui-menu-item",
                itemText: /* @__PURE__ */ _("div", { children: [
                  C("toolbar.logout"),
                  /* @__PURE__ */ o(Ov, { className: "menuIcon" })
                ] }),
                "aria-label": "logout",
                hasDivider: !0,
                onClick: () => J(),
                closeMenu: () => {
                }
              }
            ),
            N.map((de, ne) => /* @__PURE__ */ o(
              Ot,
              {
                className: "agent-ui-menu-item",
                itemText: /* @__PURE__ */ _("div", { className: "menu-sub-item", children: [
                  /* @__PURE__ */ o("span", { children: de.label }),
                  /* @__PURE__ */ o(de.buttonIcon, { className: "menuIcon" })
                ] }),
                "aria-label": de.label,
                onClick: () => de.callback(),
                closeMenu: () => {
                }
              },
              `dropdown-button-${ne}`
            ))
          ]
        }
      ),
      /* @__PURE__ */ o(
        hv,
        {
          prefix: "IBM",
          color: d ? "#ffffff" : "#000000",
          children: s
        }
      )
    ] }),
    /* @__PURE__ */ _("div", { className: "toolbar-sub-item", children: [
      !U && (H || L === "indefinite" && x?.["X-ibm-org"]) && /* @__PURE__ */ o("div", { className: "env-details", children: /* @__PURE__ */ o(
        Re,
        {
          kind: "ghost",
          onClick: () => j("readOnlySettings"),
          children: /* @__PURE__ */ o("span", { className: "orgTruncation", children: H || L === "indefinite" && x?.["X-ibm-org"] })
        }
      ) }),
      /* @__PURE__ */ o("div", { className: "language-indicator", children: /* @__PURE__ */ o(
        ql,
        {
          align: "bottom",
          label: C("chat.languageNotificationMessage", {
            language: F
          }),
          children: /* @__PURE__ */ o(
            Re,
            {
              kind: "ghost",
              size: "sm",
              className: "language-button",
              children: F
            }
          )
        }
      ) }),
      w && /* @__PURE__ */ o(
        Re,
        {
          kind: "ghost",
          size: "sm",
          hasIconOnly: !0,
          iconDescription: S ? "Close Sidebar" : "Open Sidebar",
          renderIcon: () => S ? /* @__PURE__ */ o(Bv, {}) : /* @__PURE__ */ o(Fv, {}),
          onClick: () => j(S ? "closeSidebar" : "openSidebar"),
          className: "sidebar-toggle-button"
        }
      ),
      b.map((de, ne) => /* @__PURE__ */ o(
        Re,
        {
          kind: "ghost",
          size: "sm",
          hasIconOnly: !0,
          iconDescription: de.label,
          tooltipAlignment: "end",
          tooltipPosition: "bottom",
          renderIcon: () => /* @__PURE__ */ o(de.buttonIcon, {}),
          onClick: () => de.callback(),
          className: "toolbar-custom-button"
        },
        `right-button-${ne}`
      )),
      /* @__PURE__ */ o(
        pv,
        {
          className: "aiSlug",
          size: "xs",
          children: /* @__PURE__ */ o(fv, { children: se })
        }
      )
    ] })
  ] }) });
}
const U1 = ({
  prompts: s
}) => {
  const l = (d) => {
    navigator.clipboard.writeText(d);
  };
  return /* @__PURE__ */ o("div", { className: "sample-prompts-container", children: /* @__PURE__ */ o("div", { className: "prompt-list", children: s.map((d) => /* @__PURE__ */ _(
    mv,
    {
      className: "prompts-list-item",
      children: [
        /* @__PURE__ */ o("div", { className: "prompt-content", children: /* @__PURE__ */ o("div", { className: "prompt-title", children: d }) }),
        /* @__PURE__ */ o("div", { className: "prompt-copy-button", children: /* @__PURE__ */ o(
          da,
          {
            align: "left",
            onClick: () => l(d)
          }
        ) })
      ]
    },
    `prompt_${d}`
  )) }) });
}, ib = (s) => [
  {
    key: "Authorization",
    description: s("updateHeaders.authorizationDescription"),
    type: "text",
    placeholder: s("updateHeaders.authorizationPlaceholder")
  },
  {
    key: "X-ibm-user",
    description: s("updateHeaders.userIdDescription"),
    type: "text"
  },
  {
    key: "X-ibm-org",
    description: s("updateHeaders.orgIdDescription"),
    type: "text"
  },
  {
    key: "X-ibm-agent-frontend-context",
    description: s("updateHeaders.frontendContextDescription"),
    type: "json"
  },
  {
    key: "X-ibm-agent-auth-context",
    description: s("updateHeaders.authContextDescription"),
    type: "json"
  }
], lb = (s) => [
  {
    key: "Authorization",
    description: s("updateHeaders.authorizationDescription"),
    type: "text",
    placeholder: s("updateHeaders.authorizationPlaceholder")
  },
  {
    key: "X-ibm-user",
    description: s("updateHeaders.userIdDescription"),
    type: "text"
  },
  {
    key: "X-ibm-org",
    description: s("updateHeaders.orgIdDescription"),
    type: "text"
  }
], cb = (s) => [
  {
    key: "Authorization",
    description: s("updateHeaders.authorizationDescription"),
    type: "text",
    placeholder: s("updateHeaders.authorizationPlaceholder")
  },
  {
    key: "X-ibm-user",
    description: s("updateHeaders.userIdDescription"),
    type: "text"
  }
], ub = (s) => ({
  APIC: ib(s),
  AICS: lb(s),
  Solis: cb(s)
}), db = [
  { value: "APIC", label: "API Connect", enabled: !0 },
  { value: "AICS", label: "AICS", enabled: !0 },
  { value: "Solis", label: "Solis", enabled: !1 }
], B1 = ({
  apiConfig: s,
  onClose: l,
  isOpen: d,
  showHostUrl: p = !1
}) => {
  const { t: h } = vn(), { apiService: f } = Ar(), [v, w] = R([]), [S, N] = R({}), [b, C] = R(""), [T, x] = R(!1), [L, G] = R(""), [H, U] = R(""), [M, F] = R(0), [J, j] = R("APIC"), [se, te] = R(!1), [de, ne] = R(""), [B, z] = R(""), [$, he] = R(""), [Ae, ye] = R(!1), [Ne, Ce] = R(""), [Le, ae] = R(!1), [le, xe] = R(null), qe = wr(() => ub(h), [h]), Ve = wr(
    () => qe[J],
    [J, qe]
  ), ft = Nt(
    (I) => {
      const c = js(), Z = zl(), ce = {}, Se = /* @__PURE__ */ new Set();
      Object.values(qe).forEach((Fe) => {
        Fe.forEach((Yt) => Se.add(Yt.key.toLowerCase()));
      }), c.forEach((Fe) => {
        Se.has(Fe.key.toLowerCase()) && (ce[Fe.key] = Fe.value);
      });
      const Q = qe[I], Ze = {};
      return Q.forEach((Fe) => {
        Z === I ? Ze[Fe.key] = ce[Fe.key] || "" : Ze[Fe.key] = "";
      }), Ze;
    },
    [qe]
  );
  Ee(() => {
    if (Object.keys(S).length === 0)
      return;
    const c = qe[J].map((Q) => Q.key).sort(), Z = Object.keys(S).sort();
    if (c.length === Z.length && c.every(
      (Q, Ze) => Q === Z[Ze]
    ))
      return;
    const Se = ft(J);
    N(Se), x(!0);
  }, [J, S, ft]), Ee(() => {
    if (d) {
      const I = js(), c = cc(), Z = zl();
      let ce = "APIC";
      Z && (Z === "APIC" || Z === "AICS" || Z === "Solis") && (ce = Z);
      const Se = [], Q = /* @__PURE__ */ new Set();
      Object.values(qe).forEach((Fe) => {
        Fe.forEach((Yt) => Q.add(Yt.key.toLowerCase()));
      }), I.forEach((Fe) => {
        Q.has(Fe.key.toLowerCase()) || Se.push(Fe);
      });
      const Ze = ft(ce);
      N(Ze), w(Se), C(c || ""), j(ce), G(""), U(""), x(!1), xe(null);
    }
  }, [d]);
  const Mt = Nt(() => {
    const I = {
      id: `header_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      key: "",
      value: ""
    };
    w((c) => [...c, I]), x(!0);
  }, []), Te = Nt((I) => {
    w((c) => c.filter((Z) => Z.id !== I)), x(!0);
  }, []), xt = Nt((I, c) => {
    w(
      (Z) => Z.map(
        (ce) => ce.id === I ? { ...ce, key: c } : ce
      )
    ), x(!0);
  }, []), Ke = Nt((I, c) => {
    w(
      (Z) => Z.map(
        (ce) => ce.id === I ? { ...ce, value: c } : ce
      )
    ), x(!0);
  }, []), rt = Nt(
    (I, c) => {
      N((Z) => ({
        ...Z,
        [I]: c
      })), x(!0);
    },
    []
  ), Je = Nt((I) => {
    N((c) => ({
      ...c,
      [I]: ""
    })), x(!0);
  }, []), ie = Nt(() => {
    l && l();
  }, [l]), Ie = async () => {
    if (v.filter(
      (Q) => Q.key.trim() !== "" && Q.value.trim() === "" || Q.key.trim() === "" && Q.value.trim() !== ""
    ).length > 0) {
      G(h("updateHeaders.incompleteHeadersError"));
      return;
    }
    const Z = v.filter(
      (Q) => Q.key.trim() !== "" && Q.value.trim() !== ""
    ).filter(
      (Q) => !Q.key.toLowerCase().startsWith("x-ibm-")
    );
    if (Z.length > 0) {
      const Q = Z.map((Ze) => Ze.key).join(", ");
      G(
        h("updateHeaders.invalidHeaderKeysError", { keys: Q })
      );
      return;
    }
    const ce = pe;
    if (G(""), p && b.trim() !== "") {
      ae(!0), xe(null);
      const Q = await X(ce);
      if (xe(Q), ae(!1), !Q.success)
        return;
    }
    Dy(ce), Ry(b.trim()), zy(J), x(!1), f && f.refreshCustomHeaders(), F(ce.length);
    const Se = p && b.trim() !== "";
    if (ce.length > 0 || Se) {
      const Q = [];
      if (ce.length > 0) {
        const Fe = ce.length === 1 ? h("updateHeaders.headerText") : h("updateHeaders.headersText");
        Q.push(`${ce.length} ${Fe}`);
      }
      Se && Q.push(h("updateHeaders.hostUrlText"));
      const Ze = Q.length === 1 ? "has" : "have";
      U(
        h("updateHeaders.savedSuccessMessage", {
          items: Q.join(" and "),
          verb: Ze
        })
      );
    } else {
      const Q = h(p ? "updateHeaders.noItemsSavedMessage" : "updateHeaders.noHeadersSavedMessage");
      U(Q);
    }
    setTimeout(() => {
      l && l();
    }, 3e3);
  }, pe = wr(() => {
    const I = Object.entries(
      S
    ).filter(([Z, ce]) => ce.trim() !== "").map(([Z, ce]) => ({
      id: `predefined_${Z}`,
      key: Z,
      value: ce
    })), c = v.filter(
      (Z) => Z.key.trim() !== "" && Z.value.trim() !== ""
    );
    return [...I, ...c];
  }, [S, v]), _e = Nt(async () => {
    ae(!0), xe(null);
    const I = await X(pe);
    xe(I), ae(!1);
  }, [pe, b]), X = Nt(
    async (I) => {
      try {
        const c = lc(I), { status: Z, statusText: ce } = await Ur(b.trim() + "/v1/chats", {
          headers: c
        }), Se = ce || "No status text";
        return Z >= 200 && Z < 300 ? {
          success: !0,
          message: h("updateHeaders.successMessage", {
            status: Z,
            statusText: Se
          }),
          status: Z
        } : {
          success: !1,
          message: h("updateHeaders.failedMessage", {
            status: Z,
            statusText: Se
          }),
          status: Z
        };
      } catch (c) {
        const Z = c?.message || "Unknown error", ce = c?.response?.status, Se = c?.response?.statusText || "";
        return {
          success: !1,
          message: h("updateHeaders.requestFailedMessage", {
            statusInfo: ce ? ` with status ${ce} ${Se}` : "",
            error: Z
          }),
          status: ce
        };
      }
    },
    [b]
  ), O = async () => {
    if (!de.trim() || !B.trim() || !$.trim()) {
      Ce("All fields are required to generate MCSP token");
      return;
    }
    ye(!0), Ce("");
    try {
      const I = s?.hostUrl, c = await fetch(`${I}/api/generate-mcsp-token`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          generateMcspTokenApi: de.trim(),
          mcspApiKey: B.trim(),
          instance_id: $.trim()
        })
      });
      if (!c.ok) {
        const Q = await c.text();
        throw new Error(
          `Token generation failed. Status: ${c.status}. ${Q}`
        );
      }
      const Z = await c.json(), ce = Z.token, Se = Z.token_type;
      if (!ce)
        throw new Error("Token not found in response body");
      rt("Authorization", `${Se} ${ce}`), te(!1), U("MCSP token generated and set successfully!"), ne(""), z(""), he("");
    } catch (I) {
      console.error("Failed to generate MCSP token:", I), Ce(I.message || "Failed to generate MCSP token");
    } finally {
      ye(!1);
    }
  }, q = () => {
    te(!1), Ce(""), ne(""), z(""), he("");
  };
  return /* @__PURE__ */ _("div", { className: "update-headers-container", children: [
    /* @__PURE__ */ _("div", { children: [
      h("updateHeaders.mainDescription"),
      " ",
      /* @__PURE__ */ _(
        gv,
        {
          align: "right",
          autoAlign: !0,
          children: [
            /* @__PURE__ */ o(vv, { label: h("updateHeaders.showBestPractices"), children: /* @__PURE__ */ o(jv, {}) }),
            /* @__PURE__ */ _(yv, { children: [
              /* @__PURE__ */ o("p", { children: h("updateHeaders.bestPractice1") }),
              /* @__PURE__ */ o("p", { children: h("updateHeaders.bestPractice2") }),
              /* @__PURE__ */ o("p", { children: h("updateHeaders.bestPractice3") }),
              /* @__PURE__ */ o("p", { children: h("updateHeaders.bestPractice4") })
            ] })
          ]
        }
      )
    ] }),
    /* @__PURE__ */ o(
      Zt,
      {
        "aria-label": "closes notification",
        kind: "warning",
        hideCloseButton: !0,
        statusIconDescription: h("updateHeaders.warningStatus"),
        subtitle: h("updateHeaders.securityNoteSubtitle"),
        title: h("updateHeaders.securityNoteTitle"),
        lowContrast: !0
      }
    ),
    p && /* @__PURE__ */ o("div", { className: "host-url-section", children: /* @__PURE__ */ o(Ct, { legendText: "", children: /* @__PURE__ */ o(
      _t,
      {
        id: "host-url-input",
        labelText: h("updateHeaders.apiHostUrlLabel"),
        placeholder: h("updateHeaders.apiHostUrlPlaceholder"),
        value: b,
        onChange: (I) => {
          C(I.target.value), x(!0), xe(null);
        },
        helperText: h("updateHeaders.apiHostUrlHelper")
      }
    ) }) }),
    p && /* @__PURE__ */ o("div", { className: "agent-selector-section", children: /* @__PURE__ */ o(Ct, { legendText: "", children: /* @__PURE__ */ o(
      bv,
      {
        id: "agent-type-select",
        labelText: h("updateHeaders.selectAgentTypeLabel"),
        value: J,
        onChange: (I) => {
          j(I.target.value), x(!0);
        },
        children: db.filter((I) => I.enabled).map((I) => /* @__PURE__ */ o(
          wv,
          {
            value: I.value,
            text: I.label
          },
          I.value
        ))
      }
    ) }) }),
    p && /* @__PURE__ */ _("div", { className: "predefined-headers-section", children: [
      /* @__PURE__ */ _("div", { className: "section-header", children: [
        /* @__PURE__ */ _("div", { children: [
          /* @__PURE__ */ o("h3", { children: h("updateHeaders.agentHeadersTitle", { agent: J }) }),
          /* @__PURE__ */ o("p", { className: "section-description", children: h("updateHeaders.agentHeadersDescription", {
            agent: J
          }) })
        ] }),
        J === "AICS" && /* @__PURE__ */ o(Ht, { children: s?.hostUrl !== "http://localhost:6005" ? /* @__PURE__ */ o(
          ql,
          {
            align: "bottom",
            label: "API endpoint to fetch MCSP token not available",
            enterDelayMs: 300,
            children: /* @__PURE__ */ o("span", { style: { display: "inline-block" }, children: /* @__PURE__ */ o(
              Re,
              {
                kind: "tertiary",
                size: "sm",
                onClick: () => te(!0),
                disabled: !0,
                children: h("updateHeaders.generateMcspTokenButton")
              }
            ) })
          }
        ) : /* @__PURE__ */ o(
          Re,
          {
            kind: "tertiary",
            size: "sm",
            onClick: () => te(!0),
            children: h("updateHeaders.generateMcspTokenButton")
          }
        ) })
      ] }),
      /* @__PURE__ */ o("div", { className: "predefined-headers-list", children: Ve.map((I) => /* @__PURE__ */ o(
        Ct,
        {
          className: "predefined-header-row",
          legendText: "",
          children: /* @__PURE__ */ _("div", { className: "header-inputs", children: [
            /* @__PURE__ */ o(
              _t,
              {
                id: `predefined-key-${I.key}`,
                labelText: h("updateHeaders.keyLabel"),
                value: I.key,
                disabled: !0,
                readOnly: !0
              }
            ),
            I.type === "json" ? /* @__PURE__ */ o(
              Gs,
              {
                id: `predefined-val-${I.key}`,
                labelText: h("updateHeaders.valueLabel"),
                helperText: I.description,
                value: S[I.key] || "",
                onChange: (c) => rt(I.key, c.target.value),
                rows: 3
              }
            ) : /* @__PURE__ */ o(
              _t,
              {
                id: `predefined-val-${I.key}`,
                labelText: h("updateHeaders.valueLabel"),
                placeholder: I.placeholder || I.description,
                value: S[I.key] || "",
                onChange: (c) => rt(I.key, c.target.value)
              }
            ),
            /* @__PURE__ */ o("div", { className: "header-actions", children: /* @__PURE__ */ o(
              Re,
              {
                kind: "ghost",
                size: "sm",
                hasIconOnly: !0,
                iconDescription: "Clear",
                renderIcon: (c) => /* @__PURE__ */ o($v, { ...c }),
                onClick: () => Je(I.key),
                disabled: !S[I.key]
              }
            ) })
          ] })
        },
        I.key
      )) })
    ] }),
    L && /* @__PURE__ */ o(
      Zt,
      {
        "aria-label": "validation error",
        kind: "error",
        hideCloseButton: !0,
        statusIconDescription: h("updateHeaders.errorStatus"),
        subtitle: L,
        title: h("updateHeaders.validationErrorTitle"),
        onCloseButtonClick: () => G("")
      }
    ),
    /* @__PURE__ */ _("div", { className: "custom-headers-section", children: [
      /* @__PURE__ */ o("h3", { children: h("updateHeaders.customHeadersTitle") }),
      /* @__PURE__ */ o("p", { className: "section-description", children: h("updateHeaders.customHeadersDescription") }),
      /* @__PURE__ */ _("div", { className: "headers-list", children: [
        v.map((I, c) => /* @__PURE__ */ o(
          Ct,
          {
            className: "custom-request-header-row",
            legendText: h("updateHeaders.customHeaderLegend", {
              number: c + 1
            }),
            children: /* @__PURE__ */ _("div", { className: "header-inputs", children: [
              /* @__PURE__ */ o(
                _t,
                {
                  id: `header-key-${I.id}`,
                  labelText: h("updateHeaders.keyLabel"),
                  placeholder: h("updateHeaders.keyPlaceholder"),
                  value: I.key,
                  onChange: (Z) => xt(I.id, Z.target.value)
                }
              ),
              /* @__PURE__ */ o(
                _t,
                {
                  id: `header-val-${I.id}`,
                  labelText: h("updateHeaders.valueLabel"),
                  placeholder: h("updateHeaders.valuePlaceholder"),
                  value: I.value,
                  onChange: (Z) => Ke(I.id, Z.target.value)
                }
              ),
              /* @__PURE__ */ o("div", { className: "header-actions", children: /* @__PURE__ */ o(
                Re,
                {
                  kind: "ghost",
                  size: "sm",
                  hasIconOnly: !0,
                  iconDescription: h("updateHeaders.deleteHeaderTooltip"),
                  renderIcon: (Z) => /* @__PURE__ */ o(qv, { ...Z }),
                  onClick: () => Te(I.id)
                }
              ) })
            ] })
          },
          I.id
        )),
        v.length === 0 && h("updateHeaders.noCustomHeaders")
      ] }),
      /* @__PURE__ */ o(
        Re,
        {
          kind: "tertiary",
          size: "sm",
          renderIcon: (I) => /* @__PURE__ */ o(Wv, { ...I }),
          onClick: Mt,
          children: h("updateHeaders.addHeaderButton")
        }
      )
    ] }),
    p && /* @__PURE__ */ _(Ht, { children: [
      /* @__PURE__ */ _("div", { className: "test-api-section", children: [
        /* @__PURE__ */ o(
          Re,
          {
            kind: "tertiary",
            size: "sm",
            renderIcon: (I) => /* @__PURE__ */ o(Gv, { ...I }),
            onClick: _e,
            disabled: Le || !b.trim(),
            children: h(Le ? "updateHeaders.testingButton" : "updateHeaders.testApiButton")
          }
        ),
        Le && /* @__PURE__ */ o(
          Os,
          {
            small: !0,
            withOverlay: !1
          }
        )
      ] }),
      le && /* @__PURE__ */ o(
        Zt,
        {
          "aria-label": "API test result",
          kind: le.success ? "success" : "error",
          hideCloseButton: !1,
          statusIconDescription: le.success ? h("updateHeaders.successStatus") : h("updateHeaders.errorStatus"),
          subtitle: le.message,
          title: le.success ? h("updateHeaders.connectionSuccessTitle") : h("updateHeaders.connectionFailedTitle"),
          onCloseButtonClick: () => xe(null),
          lowContrast: !0
        }
      )
    ] }),
    H && /* @__PURE__ */ o(
      Zt,
      {
        "aria-label": "header confirmation message",
        kind: M > 0 ? "success" : "info",
        statusIconDescription: M > 0 ? h("updateHeaders.successStatus") : "Info",
        subtitle: H,
        title: H.includes("MCSP token") ? "Token Generated" : M > 0 ? h("updateHeaders.headersSavedTitle") : h("updateHeaders.noHeadersSavedTitle"),
        onCloseButtonClick: () => U("")
      }
    ),
    /* @__PURE__ */ _("div", { className: "modal-actions", children: [
      /* @__PURE__ */ o(
        Re,
        {
          kind: "secondary",
          size: "md",
          onClick: ie,
          children: h("updateHeaders.cancelButton")
        }
      ),
      /* @__PURE__ */ o(
        Re,
        {
          kind: "primary",
          size: "md",
          renderIcon: (I) => /* @__PURE__ */ o(Yl, { ...I }),
          onClick: Ie,
          disabled: !T,
          children: h("updateHeaders.saveChangesButton")
        }
      )
    ] }),
    /* @__PURE__ */ o(
      ga,
      {
        open: se,
        onRequestClose: q,
        modalHeading: "Generate MCSP Token",
        primaryButtonText: Ae ? "Generating..." : "Generate Token",
        secondaryButtonText: "Cancel",
        onRequestSubmit: O,
        onSecondarySubmit: q,
        primaryButtonDisabled: Ae,
        children: /* @__PURE__ */ _(
          Ws,
          {
            onSubmit: (I) => {
              I.preventDefault();
            },
            children: [
              /* @__PURE__ */ o("p", { style: { marginBottom: "1rem" }, children: "Enter the required information to generate an MCSP token. The token will be automatically set in the Authorization header. Tokens do expire, so regenerate a new one if you experience authorization problems." }),
              Ne && /* @__PURE__ */ o(
                Zt,
                {
                  "aria-label": "MCSP error",
                  kind: "error",
                  hideCloseButton: !1,
                  statusIconDescription: "Error",
                  subtitle: Ne,
                  title: "Token Generation Failed",
                  onCloseButtonClick: () => Ce(""),
                  lowContrast: !0,
                  style: { marginBottom: "1rem" }
                }
              ),
              /* @__PURE__ */ o(Ct, { legendText: "", children: /* @__PURE__ */ o(
                _t,
                {
                  id: "mcsp-api-url",
                  labelText: "MCSP API URL",
                  placeholder: "e.g., https://account-iam.platform.test.saas.ibm.com/api/2.0/services",
                  value: de,
                  onChange: (I) => ne(I.target.value),
                  disabled: Ae
                }
              ) }),
              /* @__PURE__ */ o(Ct, { legendText: "", children: /* @__PURE__ */ o(
                _t,
                {
                  id: "mcsp-api-key",
                  labelText: "MCSP API Key",
                  placeholder: "Your MCSP API key",
                  value: B,
                  onChange: (I) => z(I.target.value),
                  disabled: Ae,
                  type: "password",
                  autoComplete: "off"
                }
              ) }),
              /* @__PURE__ */ o(Ct, { legendText: "", children: /* @__PURE__ */ o(
                _t,
                {
                  id: "mcsp-service-id",
                  labelText: "Service ID",
                  placeholder: "Your service ID",
                  value: $,
                  onChange: (I) => he(I.target.value),
                  disabled: Ae
                }
              ) }),
              Ae && /* @__PURE__ */ o(
                Os,
                {
                  description: "Generating token...",
                  withOverlay: !1
                }
              )
            ]
          }
        )
      }
    )
  ] });
}, F1 = ({
  url: s,
  onUIAction: l,
  height: d = "100%",
  width: p = "100%",
  className: h = "",
  isDarkTheme: f,
  details: v = []
}) => {
  const w = tt(null), [S, N] = R(d), b = Nt(
    (T) => T ? T.blob?.includes("chart") || T.blob?.includes("canvas") || T.blob?.includes("Chart.js") ? "400px" : T.blob?.includes("table") ? "350px" : d : d,
    [d]
  );
  Ee(() => {
    const T = v[0]?.extra_data?.html_resource;
    if (T) {
      const x = b(T);
      N(x);
    }
  }, [v, b]), Ee(() => {
    const T = (x) => {
      x.data?.type === "iframe-height" && N(`${x.data.height}px`);
    };
    return window.addEventListener("message", T), () => {
      window.removeEventListener("message", T);
    };
  }, []);
  const C = v[0]?.extra_data?.html_resource;
  return C?.uri?.startsWith("ui://") ? /* @__PURE__ */ o(
    "div",
    {
      ref: w,
      className: "remote-dom-container",
      style: { width: p, height: S },
      children: /* @__PURE__ */ o(
        Kv,
        {
          htmlProps: {
            sandboxPermissions: "allow-scripts allow-downloads allow-downloads-without-user-activation"
          },
          resource: C,
          onUIAction: (T) => {
            console.log("Action:", T), l?.(T);
          }
        }
      )
    }
  ) : /* @__PURE__ */ o("p", { children: "Unsupported resource" });
}, hb = Wl;
function pb({
  instances: s = [],
  apimInstances: l = [],
  onInstanceSelect: d,
  isLoading: p = !1,
  initialSelectedInstance: h
}) {
  const { setHostUrl: f, setApicToken: v, setAuth: w } = dt(), N = (l.length > 0 ? l : s).map((x) => !x.id && x.name ? { ...x, id: x.name } : x), [b, C] = R();
  return Ee(() => {
    C(
      h ? h.id || h.name : void 0
    );
  }, [h]), /* @__PURE__ */ o("div", { className: "apim-instance-selector-container", children: p ? /* @__PURE__ */ o(Xs, { width: "100%" }) : /* @__PURE__ */ _("div", { children: [
    /* @__PURE__ */ o(Av, { className: "apim-instance-selector-label", children: "Select an API Manager" }),
    /* @__PURE__ */ o(
      hb,
      {
        id: "apim-instance-dropdown",
        titleText: "",
        label: "Select an API Manager",
        items: N,
        itemToString: (x) => x ? x.name : "",
        onChange: (x) => {
          const L = x.selectedItem;
          C(L.id), L.url && f(L.url), L.access_token && v(L.access_token), L.url && L.access_token && w({
            API_URL: L.url,
            OVERRIDE_TOKEN: L.access_token,
            "X-ibm-user": "",
            "X-ibm-org": "",
            nonce: ""
          }), d(L);
        },
        selectedItem: N.find(
          (x) => x.id === b
        ),
        className: "apim-instance-dropdown"
      }
    )
  ] }) });
}
const j1 = ({ goToAPIManager: s }) => /* @__PURE__ */ o("div", { id: "apim-empty-state-container", children: /* @__PURE__ */ o(
  Jv,
  {
    title: "No API Manager configured yet",
    subtitle: /* @__PURE__ */ _("div", { children: [
      /* @__PURE__ */ _("p", { children: [
        "Go to IBM API Studio Settings ",
        ">",
        " API Managers to configure APIM instance and access API Agent."
      ] }),
      /* @__PURE__ */ o(
        Re,
        {
          renderIcon: () => /* @__PURE__ */ o(Xv, {}),
          onClick: s,
          children: "Configure API Managers"
        }
      )
    ] })
  }
) }), $1 = ({
  reconnectAPIManager: s
}) => /* @__PURE__ */ o("div", { id: "apim-disconnect-empty-state-container", children: /* @__PURE__ */ o(
  Zv,
  {
    title: "Connection error",
    subtitle: /* @__PURE__ */ _("div", { children: [
      /* @__PURE__ */ o("p", { children: "Make sure you’re logged in to a provider organization. You need a valid connection to continue with the API Agent." }),
      /* @__PURE__ */ o(
        fn,
        {
          onClick: s,
          kind: "tertiary",
          children: "Reconnect"
        }
      )
    ] })
  }
) }), fb = (s, l, d, p) => {
  if (d?.client === "apim" || d?.client === "apistudio-embedded")
    return window.apiConnectCfg?.formFactor === "aws" ? l : s;
  if (d?.client === "vscode" || d?.client === "apistudio-desktop") {
    if (p)
      try {
        return Vs(p).realm?.includes("ibm-verify") ? l : s;
      } catch {
        return s;
      }
    return s;
  }
  return s;
}, mb = (s, l, d) => {
  l?.client === "vscode" && d ? d.postMessage({
    type: "openAgentDocumentation",
    value: s
  }) : window.open(s, "_blank");
}, hc = (s, l, d, p, h, f) => {
  const v = fb(l, d, p, f);
  return /* @__PURE__ */ o(
    "a",
    {
      href: v,
      target: "_blank",
      rel: "noopener noreferrer",
      onClick: (S) => {
        S.preventDefault(), mb(v, p, h);
      },
      children: s
    }
  );
}, q1 = (s, l, d) => hc(
  "documentation.",
  ha,
  $s,
  l,
  d,
  s
), Qs = (s, l, d) => hc(
  "Learn more about configuring API Agent.",
  rb,
  nb,
  s,
  l,
  d
), pc = ({
  isError: s,
  setIsError: l,
  errorMessage: d,
  frontendClient: p,
  title: h = "No provider organizations",
  vscode: f,
  children: v
}) => {
  if (!s) return null;
  async function w() {
    f.postMessage({
      type: "logout",
      value: ""
    });
  }
  return p?.client === "vscode" ? /* @__PURE__ */ o(
    _v,
    {
      actionButtonLabel: "Logout",
      "aria-label": "close notification",
      hideCloseButton: !0,
      kind: "error",
      onActionButtonClick: () => {
        w();
      },
      statusIconDescription: "notification",
      subtitle: d,
      title: h,
      children: v
    }
  ) : /* @__PURE__ */ o(
    Zt,
    {
      "aria-label": "closes notification",
      kind: "error",
      onClose: () => l(!1),
      onCloseButtonClick: () => l(!1),
      statusIconDescription: "notification",
      subtitle: d,
      title: h,
      children: v
    }
  );
}, fc = fa(null), mc = () => ma(fc), W1 = ({ children: s }) => {
  const [l, d] = R(null), p = (v) => {
    let w;
    v?.response?.data?.message?.[0] ? w = v.response.data.message[0] : typeof v == "string" ? w = v : v.response ? w = `${v.response.statusText}` : v.message ? v.element ? w = v : w = `${v.message}` : w = "An unexpected error has occurred. Please try again.", (!w || typeof w == "string" && w.trim() === "") && (w = "An unexpected error has occurred. Please try again."), console.error(w, v), d(w);
  }, h = () => {
    d(null);
  }, f = wr(
    () => ({
      error: l,
      setError: p,
      clearError: h
    }),
    [l, p, h]
  );
  return /* @__PURE__ */ o(fc.Provider, { value: f, children: s });
}, gc = async (s, l, d, p, h) => {
  const f = {
    porgs: [],
    isPorgError: !1
  };
  try {
    const v = await s?.fetchOrgs();
    if (v?.data?.results) {
      const w = v.data.results.map(
        (S) => ({
          name: S.name,
          title: S.title
        })
      );
      f.porgs = w, f.isPorgError = w.length === 0;
    } else
      console.error("Invalid response from fetchOrgs()", v), f.isPorgError = !0;
  } catch (v) {
    if (console.error("Error fetching organizations:", v), l) {
      const w = Qs(p, d, h);
      l({
        ...{
          message: ab
        },
        element: w
      });
    } else
      f.isPorgError = !0;
  }
  return f;
};
function G1({
  vscode: s,
  frontendClient: l,
  accessToken: d,
  setShowAPIMSelection: p,
  onPorgSelectedCallback: h
}) {
  const { apiService: f, isPorgError: v, setPorg: w, setIsPorgError: S } = Ar(), { isApprovalSubmitting: N, setShowPorgSelection: b } = dt(), { setError: C, clearError: T } = mc(), [x, L] = R(""), [G, H] = R([]), [U] = R(dc), M = Qs(l, s, d);
  Ee(() => {
    (async () => {
      T();
      const se = await gc(
        f,
        C,
        s,
        l,
        d
      );
      H(se.porgs), S(se.isPorgError);
    })();
  }, [f]);
  const F = (j) => {
    L(j), T();
  }, J = () => {
    w(x), s?.postMessage({
      type: "savePorg",
      value: x
    }), b(!1), p && p(!1), f?.setPorg(x), h && h(x);
  };
  return /* @__PURE__ */ _("div", { className: "pick-porg-container bx--grid", children: [
    G.length > 0 ? /* @__PURE__ */ _("div", { className: "bx--row", children: [
      /* @__PURE__ */ _("div", { className: "chat-bubble pick-porg-description", children: [
        /* @__PURE__ */ o("div", { children: "The following provider organization(s) are enabled in API Manager." }),
        /* @__PURE__ */ o("div", { children: "Which one would you like to use?" })
      ] }),
      /* @__PURE__ */ o(Ct, { legendText: "", children: /* @__PURE__ */ o(Gl, { gap: 7, children: /* @__PURE__ */ o(
        Xl,
        {
          name: "porg",
          legendText: "Provider organization",
          orientation: "vertical",
          onChange: (j) => {
            F(j);
          },
          children: G?.map((j) => /* @__PURE__ */ o(
            Vl,
            {
              labelText: j.name,
              name: j.name,
              value: j.name,
              disabled: N,
              checked: j.name === x
            },
            j.name
          ))
        }
      ) }) }),
      /* @__PURE__ */ o(Ct, { legendText: "", children: /* @__PURE__ */ o(
        fn,
        {
          isQuickAction: !0,
          disabled: !x,
          onClick: J,
          children: "Continue"
        }
      ) })
    ] }) : /* @__PURE__ */ o(Xs, { width: "120px" }),
    v && G.length === 0 && /* @__PURE__ */ o(
      pc,
      {
        isError: v,
        setIsError: S,
        errorMessage: U,
        frontendClient: l,
        title: "No provider organizations",
        vscode: s,
        children: M
      }
    )
  ] });
}
function gb({
  selectedPorg: s,
  onPorgSelectedCallback: l,
  isOpen: d = !1,
  vscode: p,
  frontendClient: h,
  accessToken: f
}) {
  const { apiService: v } = Ar(), { isApprovalSubmitting: w } = dt(), [S, N] = R([]), [b, C] = R(!1), [T] = R(dc), [x, L] = R(!1), G = Qs(h, p, f);
  Ee(() => {
    d && v && (async () => {
      L(!0);
      const F = await gc(
        v,
        p,
        h,
        f
      );
      N(F.porgs), C(F.isPorgError), L(!1);
    })();
  }, [v, d]);
  const H = async (M) => {
    l && l(M);
  };
  return /* @__PURE__ */ o("div", { className: "pick-porg-container bx--grid", children: x ? /* @__PURE__ */ o(Xs, { width: "120px" }) : S.length > 0 ? /* @__PURE__ */ o("div", { className: "bx--row", children: /* @__PURE__ */ o(Ct, { legendText: "", children: /* @__PURE__ */ o(Gl, { gap: 7, children: /* @__PURE__ */ o(
    Xl,
    {
      name: "porg",
      legendText: "Select a provider organization",
      orientation: "vertical",
      defaultSelected: s ?? void 0,
      onChange: (M) => {
        H(M);
      },
      children: S?.map((M) => /* @__PURE__ */ o(
        Vl,
        {
          labelText: M.name,
          name: M.name,
          value: M.name,
          disabled: w
        },
        M.name
      ))
    },
    s === void 0 ? "reset" : "active"
  ) }) }) }) : /* @__PURE__ */ o(
    pc,
    {
      isError: b,
      setIsError: C,
      errorMessage: T,
      title: "No provider organizations",
      children: G
    }
  ) });
}
function X1({
  open: s,
  parentContext: l,
  frontendClient: d,
  onClose: p,
  vscode: h,
  accessToken: f,
  onPorgSelectedCallback: v,
  selectedAPIMInstance: w,
  setSelectedAPIMInstance: S
}) {
  const { apiService: N, configureService: b, setPorg: C, porg: T } = Ar(), { setShowPorgSelection: x } = dt(), { clearError: L } = mc(), [G, H] = R(!1), [U, M] = R(void 0), [F, J] = R(void 0), [j, se] = R(f || void 0), te = d?.client;
  Ee(() => {
    s ? (L(), M(T), J(w), w && (b(
      w.url,
      "api-agent/api-assistant",
      w.access_token,
      "",
      T,
      d,
      {}
      // MCP authContext, in vscode-only, not relevant to web
    ), se(w.access_token)), (te === "vscode" || w) && H(!0)) : (M(void 0), J(void 0), H(!1));
  }, [s, T, w]);
  const de = ($) => {
    M($), L();
  }, ne = ($) => {
    J($), se($.access_token), M(void 0), b(
      $.url,
      "api-agent/api-assistant",
      $.access_token,
      "",
      "",
      d,
      {}
      // MCP authContext, in vscode-only, not relevant to web
    ), H(!0);
  }, B = () => {
    F && b(
      F.url,
      "api-agent/api-assistant",
      F.access_token,
      "",
      U,
      d,
      {}
      // MCP authContext, in vscode-only, not relevant to web
    ), C(U), h?.postMessage({
      type: "savePorg",
      value: U
    }), x(!1), N?.setPorg(U), F && S && S(F), v && setTimeout(() => {
      v(U, F);
    }, 0);
  };
  return /* @__PURE__ */ _(
    ga,
    {
      className: "porg-picker-modal",
      modalHeading: "",
      open: s,
      size: "lg",
      primaryButtonText: "Update",
      secondaryButtonText: "Cancel",
      onRequestClose: p,
      onRequestSubmit: () => {
        B(), p();
      },
      primaryButtonDisabled: !U,
      preventCloseOnClickOutside: !0,
      children: [
        te !== "vscode" && /* @__PURE__ */ o(
          pb,
          {
            apimInstances: l?.apimInstances || [],
            onInstanceSelect: ne,
            initialSelectedInstance: F
          },
          `apim-selector-${s}`
        ),
        G && /* @__PURE__ */ o(
          gb,
          {
            onPorgSelectedCallback: de,
            selectedPorg: U,
            isOpen: s,
            vscode: h,
            frontendClient: d,
            accessToken: j
          }
        )
      ]
    }
  );
}
const V1 = (s) => {
  const { hostUrl: l, auth: d, apicTokenExpirationDate: p } = dt(), { porg: h } = Ar(), f = Ks({
    "read-only-settings-container": !0,
    "modal-dark-mode": s.isDarkTheme
  });
  return /* @__PURE__ */ _("div", { className: f, children: [
    /* @__PURE__ */ o("div", { className: "modal-overlay" }),
    /* @__PURE__ */ _("div", { className: "read-only-settings-inner", children: [
      /* @__PURE__ */ _("div", { className: "read-only-settings-header", children: [
        /* @__PURE__ */ o("h4", { children: "Connection details" }),
        /* @__PURE__ */ o(
          pa,
          {
            onClick: () => s.setOpenReadOnlySettingsPage(!1),
            label: "Close",
            align: "bottom",
            children: /* @__PURE__ */ o(ec, {})
          }
        )
      ] }),
      /* @__PURE__ */ o("p", { children: "API Connect" }),
      /* @__PURE__ */ o("br", {}),
      /* @__PURE__ */ _(
        Ct,
        {
          legendText: "",
          className: "read-only-settings-container-group",
          children: [
            /* @__PURE__ */ o(
              _t,
              {
                id: "readOnlySettings-hostUrl",
                labelText: "Host Url",
                value: l,
                readOnly: !0,
                className: "read-only-settings-container-text-input"
              }
            ),
            /* @__PURE__ */ o(
              _t,
              {
                id: "readOnlySettings-hostUrl",
                labelText: "Provider organization",
                value: h || p === "indefinite" && d?.["X-ibm-org"] || "null",
                readOnly: !0,
                className: "read-only-settings-container-text-input"
              }
            )
          ]
        }
      )
    ] })
  ] });
}, K1 = ({
  apiConfig: s,
  onLanguageChange: l,
  onError: d,
  className: p = "",
  titleText: h = ""
}) => {
  const { i18n: f } = vn(), v = async (S) => {
    if (!S.selectedItem) return;
    const N = S.selectedItem;
    if (f.changeLanguage(N.id), l && l(N.label), s?.hostUrl) {
      const b = sb[N.id] || N.id;
      try {
        const C = await fetch(
          `${s.hostUrl}/api/language-locale`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              ...s.token && {
                Authorization: `Bearer ${s.token}`
              }
            },
            body: JSON.stringify({
              language_locale: b
            })
          }
        );
        if (C.ok) {
          const T = await C.json();
          console.log("Language locale updated:", T);
        } else {
          const T = `Failed to update language locale in backend: ${C.status} ${C.statusText}`;
          console.error(T), d && d(T);
        }
      } catch (C) {
        const T = `Error updating language locale: ${C instanceof Error ? C.message : String(C)}`;
        console.error(T), d && d(T);
      }
    }
  }, w = qs.find((S) => S.id === f.language)?.label || "English";
  return /* @__PURE__ */ o(
    Wl,
    {
      id: "language-selector",
      titleText: h,
      label: w,
      items: qs,
      itemToString: (S) => S ? S.label : "",
      onChange: v,
      className: p
    }
  );
};
function J1() {
  const { t: s, i18n: l } = vn(), d = [
    { code: "en", name: "English" },
    { code: "es", name: "Español" },
    { code: "fr", name: "Français" },
    { code: "de", name: "Deutsch" },
    { code: "ja", name: "日本語" },
    { code: "pt-BR", name: "Português (Brasil)" },
    { code: "zh", name: "中文" }
  ];
  return /* @__PURE__ */ _("div", { className: "i18n-demo", children: [
    /* @__PURE__ */ o("h1", { children: s("common.welcome") }),
    /* @__PURE__ */ _("div", { className: "demo-section", children: [
      /* @__PURE__ */ _("h2", { children: [
        "Current Language: ",
        l.language
      ] }),
      /* @__PURE__ */ o("p", { children: s("chat.placeholder") })
    ] }),
    /* @__PURE__ */ _("div", { className: "demo-section", children: [
      /* @__PURE__ */ o("h3", { children: "Common Translations:" }),
      /* @__PURE__ */ _("ul", { children: [
        /* @__PURE__ */ _("li", { children: [
          /* @__PURE__ */ o("strong", { children: "Loading:" }),
          " ",
          s("common.loading")
        ] }),
        /* @__PURE__ */ _("li", { children: [
          /* @__PURE__ */ o("strong", { children: "Error:" }),
          " ",
          s("common.error")
        ] }),
        /* @__PURE__ */ _("li", { children: [
          /* @__PURE__ */ o("strong", { children: "Success:" }),
          " ",
          s("common.success")
        ] }),
        /* @__PURE__ */ _("li", { children: [
          /* @__PURE__ */ o("strong", { children: "Submit:" }),
          " ",
          s("common.submit")
        ] }),
        /* @__PURE__ */ _("li", { children: [
          /* @__PURE__ */ o("strong", { children: "Cancel:" }),
          " ",
          s("common.cancel")
        ] })
      ] })
    ] }),
    /* @__PURE__ */ _("div", { className: "demo-section", children: [
      /* @__PURE__ */ o("h3", { children: "Interpolation Example:" }),
      /* @__PURE__ */ o("p", { children: s("validation.minLength", { min: 5 }) }),
      /* @__PURE__ */ o("p", { children: s("validation.maxLength", { max: 100 }) })
    ] }),
    /* @__PURE__ */ _("div", { className: "demo-section", children: [
      /* @__PURE__ */ o("h3", { children: "Switch Language:" }),
      /* @__PURE__ */ o("div", { className: "language-buttons", children: d.map((p) => /* @__PURE__ */ o(
        Re,
        {
          kind: l.language === p.code ? "primary" : "secondary",
          size: "sm",
          onClick: () => l.changeLanguage(p.code),
          children: p.name
        },
        p.code
      )) })
    ] }),
    /* @__PURE__ */ _("div", { className: "demo-section", children: [
      /* @__PURE__ */ o("h3", { children: "Error Messages:" }),
      /* @__PURE__ */ _("ul", { children: [
        /* @__PURE__ */ o("li", { children: s("errors.generic") }),
        /* @__PURE__ */ o("li", { children: s("errors.network") }),
        /* @__PURE__ */ o("li", { children: s("errors.unauthorized") })
      ] })
    ] })
  ] });
}
const vb = (s, l, d) => {
  let p = ha;
  const h = l?.client;
  if (h === "apistudio-desktop" || h === "vscode")
    p = (s ? Vs(s) : {})?.realm?.includes("provider/ibm-verify") ? $s : ha;
  else {
    const { formFactor: f } = window.apiConnectCfg || {};
    p = `${f === "aws" ? $s : ha}`;
  }
  return /* @__PURE__ */ o(
    Cv,
    {
      target: "_blank",
      rel: "noopener noreferrer",
      onClick: () => {
        h === "vscode" ? d.postMessage({
          type: "openAgentDocumentation",
          value: p
        }) : window.open(p, "_blank");
      },
      children: "documentation."
    }
  );
}, yb = { welcome: "Welcome", loading: "Loading...", error: "Error", success: "Success", cancel: "Cancel", submit: "Submit", save: "Save", delete: "Delete", edit: "Edit", close: "Close", search: "Search", filter: "Filter", clear: "Clear", back: "Back", next: "Next", previous: "Previous", confirm: "Confirm", yes: "Yes", no: "No" }, bb = { apiSettings: "API Settings", apiSettingsDescription: "Configure headers and host URL", newChat: "New chat", recentChats: "Recent chats", noConversations: "No conversations yet", clickNewChat: "Click New Chat to start", emptyChat: "Empty chat", errorFetchingChats: "Error occurred when fetching chats", configureApiSettings: "Configure API Settings" }, wb = { apiAgentGreeting: "Hi! I'm your API Agent. You're now connected to API Connect provider organization {{porg}}.", exploreCommands: 'Explore quick commands by typing "/" in the prompt line. Here are some tasks I can help with:', limitations: "There are some limitations in what I can do today. For more information, see", sampleAgentGreeting: "Hi! I'm your Sample Agent. You can now experiment on this agent.", createApi: "Create API", publishApi: "Publish API", queryAnalytics: "Query Analytics", searchApis: "Search APIs", useSampleTools: "Use ARIA Sample Tools", experimentCapabilities: "Experiment with ARIA Framework Capabilities" }, Ab = { placeholder: "Type your message...", send: "Send", newChat: "New Chat", clearHistory: "Clear History", exportChat: "Export Chat", copyMessage: "Copy Message", regenerate: "Regenerate", stop: "Stop", thinking: "Thinking...", typing: "Typing...", samplePrompts: "Sample prompts", unknownFile: "Unknown file", languageNotificationMessage: "Current language: {{language}}. Note: This setting applies to new chats only. Previously created chats retain their original language and cannot be changed.", selectLanguage: "Select your language" }, _b = { errorCreatingChat: "Error creating new chat", errorFetchingChat: "Error occurred when fetching chats", errorProcessingSelection: "Error processing selection", errorProcessingAttachments: "Error processing file attachments", errorSendingMessage: "Error sending message", streamingError: "Streaming error occurred", disclaimerAccuracy: "Accuracy of generated answers may vary.", disclaimerDoubleCheck: "Please double-check responses.", uploadedSuccessfully: "Uploaded successfully:" }, Cb = { backToChats: "Back to chats", samplePrompts: "Sample prompts", newChat: "New chat", switchOrganization: "Switch organization", updateHttpHeaders: "Update HTTP headers", logout: "Logout", aiExplained: "AI explained", aiAgent: "AI Agent", accelerateDevelopment: "Accelerate development with AI to help streamline parts of the API lifecycle management.", howItWorks: "How it works", aiCanAssist: "AI can assist with API creation, publishing and testing. AI leverages existing sources in API Connect to help.", analyze: "Analyze:", analyzeDescription: "AI can assist you by analyzing user inputs and using appropriate tools to execute your request.", recommend: "Recommend:", recommendDescription: "AI responds by using trained models to provide relevant answers.", baseAiModels: "Base AI models", additionalModels: "Additional models", additionalDetails: "Additional details", baseModelDescription: "The base model was trained and fine tuned on a mix of natural language and code data in multiple languages. The additional models might be used to perform actions." }, xb = { hideSteps: "Hide steps", showSteps: "Show steps", hideScratchpad: "Hide scratchpad", showScratchpad: "Show scratchpad", chatSessionId: "Chat session ID", requestId: "Request ID", debug: "Debug" }, Sb = { send: "Send", uploadingFiles: "Uploading files...", addImage: "Add image", removeFile: "Remove file", placeholder: `How can I help you?

💡 Pro Tip: The more specific you are, the better I can help!
Use @ to add files, use / to list commands` }, Ib = { mainDescription: "Create, modify, or remove custom HTTP headers and their associated values. These headers will be applied to all outgoing API requests.", showBestPractices: "Show best practices", bestPractice1: "Always use the exact, correct header names, header values, and API host URL. Incorrect or malformed values can cause the UI to error, fail API requests, or appear blank with no diagnostics.", bestPractice2: "Custom headers not allowed by the backend may trigger CORS failures, preventing the UI from loading.", bestPractice3: "Test your API calls beforehand using an external tool such as curl to confirm the values work before applying them here.", bestPractice4: "Be prepared to reset local storage to default manually if a misconfiguration breaks the UI or values expire. This can be done through your browser's developer console localStorage.removeItem ('custom_host_url') localStorage.removeItem ('custom_http_headers').", securityNoteTitle: "Security Note", securityNoteSubtitle: "Information is stored locally in your browser and persists until manually cleared or removed by the browser. Because it may contain sensitive data, it should be used for development purposes only. Use at your own discretion.", warningStatus: "Warning", apiHostUrlLabel: "API Host URL (Optional)", apiHostUrlPlaceholder: "e.g., https://api.example.com", apiHostUrlHelper: "Override the default API host URL. Leave empty to use the default configuration.", ibmHeadersTitle: "IBM Headers (Optional Overrides)", ibmHeadersDescription: "Override default IBM header values. Leave empty to use system defaults.", keyLabel: "Key", valueLabel: "Value", clearHeaderTooltip: "Clear this header", validationErrorTitle: "Validation Error", incompleteHeadersError: "All header rows must have both key and value filled in, or leave both empty to skip.", invalidHeaderKeysError: 'Invalid header key(s): {{keys}}. All custom header keys must start with "x-ibm-" (case-insensitive).', customHeadersTitle: "Additional Custom Headers", customHeadersDescription: 'Add any additional X-ibm- headers that are not listed above. All custom header keys must start with "X-ibm-".', customHeaderLegend: "Custom request header {{number}}", keyPlaceholder: "e.g., X-ibm-custom-header", valuePlaceholder: "e.g., custom-value", deleteHeaderTooltip: "Delete header", noCustomHeaders: "There are no custom headers set", addHeaderButton: "Add header", testingButton: "Testing...", testApiButton: "Test API Connection", connectionSuccessTitle: "Connection Successful", connectionFailedTitle: "Connection Failed", successStatus: "Success", errorStatus: "Error", successMessage: "Success! Status: {{status}} {{statusText}}", failedMessage: "Failed with status {{status}} {{statusText}}", requestFailedMessage: "Request failed{{statusInfo}}: {{error}}", headersSavedTitle: "Headers Saved", noHeadersSavedTitle: "No Headers Saved", savedSuccessMessage: "{{items}} {{verb}} been saved successfully.", noItemsSavedMessage: "No headers or host URL were saved. All fields were empty or removed.", noHeadersSavedMessage: "No headers were saved. All fields were empty or removed.", headerText: "header", headersText: "headers", hostUrlText: "host URL", cancelButton: "Cancel", saveChangesButton: "Save changes", selectAgentTypeLabel: "Select Agent Type", agentHeadersTitle: "{{agent}} Headers (Optional Overrides)", agentHeadersDescription: "Override default {{agent}} header values. Leave empty to use system defaults.", generateMcspTokenButton: "Generate MCSP Token", authorizationDescription: "Bearer token for authentication", authorizationPlaceholder: "Bearer <your-token>", userIdDescription: "User id", orgIdDescription: "Provider organization id", frontendContextDescription: 'JSON string with frontend context. Example: {"key": "value"}', authContextDescription: 'JSON string with auth context. Example: {"auth_values": {"mcpSecrets": {...}}}', tokenGenerated: "Token generated" }, kb = { generic: "Something went wrong", network: "Network error. Please check your connection.", timeout: "Request timed out. Please try again.", unauthorized: "Unauthorized. Please log in.", notFound: "Resource not found", serverError: "Server error. Please try again later." }, Pb = { required: "This field is required", invalidEmail: "Invalid email address", minLength: "Minimum length is {{min}} characters", maxLength: "Maximum length is {{max}} characters" }, Tb = {
  common: yb,
  landingPage: bb,
  welcomeMessage: wb,
  chat: Ab,
  chatPane: _b,
  toolbar: Cb,
  messageHeader: xb,
  promptInput: Sb,
  updateHeaders: Ib,
  errors: kb,
  validation: Pb
}, Eb = { welcome: "Bienvenido", loading: "Cargando...", error: "Error", success: "Éxito", cancel: "Cancelar", submit: "Enviar", save: "Guardar", delete: "Eliminar", edit: "Editar", close: "Cerrar", search: "Buscar", filter: "Filtrar", clear: "Limpiar", back: "Atrás", next: "Siguiente", previous: "Anterior", confirm: "Confirmar", yes: "Sí", no: "No" }, Nb = { apiSettings: "Configuración de API", apiSettingsDescription: "Configurar encabezados y URL del host", newChat: "Nuevo chat", recentChats: "Chats recientes", noConversations: "Aún no hay conversaciones", clickNewChat: "Haz clic en Nuevo Chat para comenzar", emptyChat: "Chat vacío", errorFetchingChats: "Error al obtener los chats", configureApiSettings: "Configurar Ajustes de API" }, Hb = { apiAgentGreeting: "¡Hola! Soy tu Agente API. Ahora estás conectado a la organización proveedora de API Connect {{porg}}.", exploreCommands: 'Explora comandos rápidos escribiendo "/" en la línea de comandos. Aquí hay algunas tareas con las que puedo ayudar:', limitations: "Hay algunas limitaciones en lo que puedo hacer hoy. Para más información, consulta", sampleAgentGreeting: "¡Hola! Soy tu Agente de Muestra. Ahora puedes experimentar con este agente.", createApi: "Crear API", publishApi: "Publicar API", queryAnalytics: "Consultar Analíticas", searchApis: "Buscar APIs", useSampleTools: "Usar Herramientas de Muestra ARIA", experimentCapabilities: "Experimentar con Capacidades del Framework ARIA" }, Mb = { placeholder: "Escribe tu mensaje...", send: "Enviar", newChat: "Nuevo Chat", clearHistory: "Borrar Historial", exportChat: "Exportar Chat", copyMessage: "Copiar Mensaje", regenerate: "Regenerar", stop: "Detener", thinking: "Pensando...", typing: "Escribiendo...", samplePrompts: "Indicaciones de muestra", unknownFile: "Archivo desconocido", languageNotificationMessage: "Una vez que comienza un chat, su idioma no se puede cambiar. Para chatear en un idioma diferente, selecciona uno e inicia un nuevo chat.", selectLanguage: "Selecciona tu idioma" }, Db = { errorCreatingChat: "Error al crear nuevo chat", errorFetchingChat: "Error al obtener los chats", errorProcessingSelection: "Error al procesar la selección", errorProcessingAttachments: "Error al procesar archivos adjuntos", errorSendingMessage: "Error al enviar mensaje", streamingError: "Error de transmisión ocurrido", disclaimerAccuracy: "La precisión de las respuestas generadas puede variar.", disclaimerDoubleCheck: "Por favor, verifique las respuestas.", uploadedSuccessfully: "Subido exitosamente:" }, Rb = { backToChats: "Volver a los chats", samplePrompts: "Indicaciones de muestra", newChat: "Nuevo chat", switchOrganization: "Cambiar organización", updateHttpHeaders: "Actualizar encabezados HTTP", logout: "Cerrar sesión", aiExplained: "IA explicada", aiAgent: "Agente IA", accelerateDevelopment: "Acelere el desarrollo con IA para ayudar a optimizar partes de la gestión del ciclo de vida de la API.", howItWorks: "Cómo funciona", aiCanAssist: "La IA puede ayudar con la creación, publicación y prueba de API. La IA aprovecha las fuentes existentes en API Connect para ayudar.", analyze: "Analizar:", analyzeDescription: "La IA puede ayudarte analizando las entradas del usuario y utilizando las herramientas apropiadas para ejecutar tu solicitud.", recommend: "Recomendar:", recommendDescription: "La IA responde utilizando modelos entrenados para proporcionar respuestas relevantes.", baseAiModels: "Modelos de IA base", additionalModels: "Modelos adicionales", additionalDetails: "Detalles adicionales", baseModelDescription: "El modelo base fue entrenado y ajustado con una mezcla de lenguaje natural y datos de código en múltiples idiomas. Los modelos adicionales pueden usarse para realizar acciones." }, zb = { hideSteps: "Ocultar pasos", showSteps: "Mostrar pasos", hideScratchpad: "Ocultar bloc de notas", showScratchpad: "Mostrar bloc de notas", chatSessionId: "ID de sesión de chat", requestId: "ID de solicitud", debug: "Depurar" }, Lb = { send: "Enviar", uploadingFiles: "Subiendo archivos...", addImage: "Agregar imagen", removeFile: "Eliminar archivo", placeholder: `¿Cómo puedo ayudarte?

💡 Consejo: ¡Cuanto más específico seas, mejor podré ayudarte!
Usa @ para agregar archivos, usa / para listar comandos` }, Ob = { mainDescription: "Cree, modifique o elimine encabezados HTTP personalizados y sus valores asociados. Estos encabezados se aplicarán a todas las solicitudes de API salientes.", showBestPractices: "Mostrar mejores prácticas", bestPractice1: "Siempre use los nombres de encabezado, valores de encabezado y URL de host de API exactos y correctos. Los valores incorrectos o mal formados pueden causar errores en la interfaz de usuario, fallar las solicitudes de API o aparecer en blanco sin diagnósticos.", bestPractice2: "Los encabezados personalizados no permitidos por el backend pueden desencadenar fallas de CORS, impidiendo que se cargue la interfaz de usuario.", bestPractice3: "Pruebe sus llamadas de API de antemano usando una herramienta externa como curl para confirmar que los valores funcionan antes de aplicarlos aquí.", bestPractice4: "Esté preparado para restablecer el almacenamiento local a los valores predeterminados manualmente si una configuración incorrecta rompe la interfaz de usuario o los valores caducan. Esto se puede hacer a través de la consola de desarrollador de su navegador localStorage.removeItem ('custom_host_url') localStorage.removeItem ('custom_http_headers').", securityNoteTitle: "Nota de Seguridad", securityNoteSubtitle: "La información se almacena localmente en su navegador y persiste hasta que se borre manualmente o sea eliminada por el navegador. Debido a que puede contener datos sensibles, debe usarse solo con fines de desarrollo. Úselo bajo su propia discreción.", warningStatus: "Advertencia", apiHostUrlLabel: "URL de Host de API (Opcional)", apiHostUrlPlaceholder: "ej., https://api.example.com", apiHostUrlHelper: "Anule la URL de host de API predeterminada. Déjelo vacío para usar la configuración predeterminada.", ibmHeadersTitle: "Encabezados IBM (Anulaciones Opcionales)", ibmHeadersDescription: "Anule los valores de encabezado IBM predeterminados. Déjelo vacío para usar los valores predeterminados del sistema.", keyLabel: "Clave", valueLabel: "Valor", clearHeaderTooltip: "Borrar este encabezado", validationErrorTitle: "Error de Validación", incompleteHeadersError: "Todas las filas de encabezado deben tener tanto la clave como el valor completados, o dejar ambos vacíos para omitir.", invalidHeaderKeysError: 'Clave(s) de encabezado no válida(s): {{keys}}. Todas las claves de encabezado personalizadas deben comenzar con "x-ibm-" (sin distinción entre mayúsculas y minúsculas).', customHeadersTitle: "Encabezados Personalizados Adicionales", customHeadersDescription: 'Agregue cualquier encabezado X-ibm- adicional que no esté listado arriba. Todas las claves de encabezado personalizadas deben comenzar con "X-ibm-".', customHeaderLegend: "Encabezado de solicitud personalizado {{number}}", keyPlaceholder: "ej., X-ibm-custom-header", valuePlaceholder: "ej., custom-value", deleteHeaderTooltip: "Eliminar encabezado", noCustomHeaders: "No hay encabezados personalizados configurados", addHeaderButton: "Agregar encabezado", testingButton: "Probando...", testApiButton: "Probar Conexión de API", connectionSuccessTitle: "Conexión Exitosa", connectionFailedTitle: "Conexión Fallida", successStatus: "Éxito", errorStatus: "Error", successMessage: "¡Éxito! Estado: {{status}} {{statusText}}", failedMessage: "Falló con estado {{status}} {{statusText}}", requestFailedMessage: "La solicitud falló{{statusInfo}}: {{error}}", headersSavedTitle: "Encabezados Guardados", noHeadersSavedTitle: "No se Guardaron Encabezados", savedSuccessMessage: "{{items}} {{verb}} guardado exitosamente.", noItemsSavedMessage: "No se guardaron encabezados ni URL de host. Todos los campos estaban vacíos o fueron eliminados.", noHeadersSavedMessage: "No se guardaron encabezados. Todos los campos estaban vacíos o fueron eliminados.", headerText: "encabezado", headersText: "encabezados", hostUrlText: "URL de host", cancelButton: "Cancelar", saveChangesButton: "Guardar cambios", selectAgentTypeLabel: "Seleccionar tipo de agente", agentHeadersTitle: "Encabezados de {{agent}} (Anulaciones opcionales)", agentHeadersDescription: "Anular valores predeterminados de encabezados de {{agent}}. Dejar vacío para usar valores predeterminados del sistema.", generateMcspTokenButton: "Generar token MCSP", authorizationDescription: "Token Bearer para autenticación", authorizationPlaceholder: "Bearer <su-token>", userIdDescription: "ID de usuario", orgIdDescription: "ID de organización proveedora", frontendContextDescription: 'Cadena JSON con contexto de frontend. Ejemplo: {"key": "value"}', authContextDescription: 'Cadena JSON con contexto de autenticación. Ejemplo: {"auth_values": {"mcpSecrets": {...}}}', tokenGenerated: "Token generado" }, Ub = { generic: "Algo salió mal", network: "Error de red. Por favor verifica tu conexión.", timeout: "Tiempo de espera agotado. Por favor intenta de nuevo.", unauthorized: "No autorizado. Por favor inicia sesión.", notFound: "Recurso no encontrado", serverError: "Error del servidor. Por favor intenta más tarde." }, Bb = { required: "Este campo es obligatorio", invalidEmail: "Dirección de correo electrónico no válida", minLength: "La longitud mínima es de {{min}} caracteres", maxLength: "La longitud máxima es de {{max}} caracteres" }, Fb = {
  common: Eb,
  landingPage: Nb,
  welcomeMessage: Hb,
  chat: Mb,
  chatPane: Db,
  toolbar: Rb,
  messageHeader: zb,
  promptInput: Lb,
  updateHeaders: Ob,
  errors: Ub,
  validation: Bb
}, jb = { welcome: "Bienvenue", loading: "Chargement...", error: "Erreur", success: "Succès", cancel: "Annuler", submit: "Soumettre", save: "Enregistrer", delete: "Supprimer", edit: "Modifier", close: "Fermer", search: "Rechercher", filter: "Filtrer", clear: "Effacer", back: "Retour", next: "Suivant", previous: "Précédent", confirm: "Confirmer", yes: "Oui", no: "Non" }, $b = { apiSettings: "Paramètres API", apiSettingsDescription: "Configurer les en-têtes et l'URL de l'hôte", newChat: "Nouveau chat", recentChats: "Chats récents", noConversations: "Aucune conversation pour le moment", clickNewChat: "Cliquez sur Nouveau Chat pour commencer", emptyChat: "Chat vide", errorFetchingChats: "Erreur lors de la récupération des chats", configureApiSettings: "Configurer les Paramètres API" }, qb = { apiAgentGreeting: "Bonjour ! Je suis votre Agent API. Vous êtes maintenant connecté à l'organisation fournisseur API Connect {{porg}}.", exploreCommands: 'Explorez les commandes rapides en tapant "/" dans la ligne de commande. Voici quelques tâches avec lesquelles je peux vous aider :', limitations: "Il y a certaines limitations à ce que je peux faire aujourd'hui. Pour plus d'informations, consultez", sampleAgentGreeting: "Bonjour ! Je suis votre Agent d'Exemple. Vous pouvez maintenant expérimenter avec cet agent.", createApi: "Créer une API", publishApi: "Publier une API", queryAnalytics: "Interroger les Analyses", searchApis: "Rechercher des APIs", useSampleTools: "Utiliser les Outils d'Exemple ARIA", experimentCapabilities: "Expérimenter avec les Capacités du Framework ARIA" }, Wb = { placeholder: "Tapez votre message...", send: "Envoyer", newChat: "Nouveau Chat", clearHistory: "Effacer l'Historique", exportChat: "Exporter le Chat", copyMessage: "Copier le Message", regenerate: "Régénérer", stop: "Arrêter", thinking: "Réflexion...", typing: "Saisie...", samplePrompts: "Exemples de messages", unknownFile: "Fichier inconnu", languageNotificationMessage: "Une fois qu'un chat commence, sa langue ne peut pas être modifiée. Pour chatter dans une langue différente, sélectionnez-en une et démarrez un nouveau chat.", selectLanguage: "Sélectionnez votre langue" }, Gb = { errorCreatingChat: "Erreur lors de la création du nouveau chat", errorFetchingChat: "Erreur lors de la récupération des chats", errorProcessingSelection: "Erreur lors du traitement de la sélection", errorProcessingAttachments: "Erreur lors du traitement des pièces jointes", errorSendingMessage: "Erreur lors de l'envoi du message", streamingError: "Erreur de streaming survenue", disclaimerAccuracy: "La précision des réponses générées peut varier.", disclaimerDoubleCheck: "Veuillez vérifier les réponses.", uploadedSuccessfully: "Téléchargé avec succès :" }, Xb = { backToChats: "Retour aux chats", samplePrompts: "Exemples de messages", newChat: "Nouveau chat", switchOrganization: "Changer d'organisation", updateHttpHeaders: "Mettre à jour les en-têtes HTTP", logout: "Déconnexion", aiExplained: "IA expliquée", aiAgent: "Agent IA", accelerateDevelopment: "Accélérez le développement avec l'IA pour aider à rationaliser certaines parties de la gestion du cycle de vie de l'API.", howItWorks: "Comment ça marche", aiCanAssist: "L'IA peut aider à la création, la publication et les tests d'API. L'IA exploite les sources existantes dans API Connect pour aider.", analyze: "Analyser :", analyzeDescription: "L'IA peut vous aider en analysant les entrées utilisateur et en utilisant les outils appropriés pour exécuter votre demande.", recommend: "Recommander :", recommendDescription: "L'IA répond en utilisant des modèles entraînés pour fournir des réponses pertinentes.", baseAiModels: "Modèles d'IA de base", additionalModels: "Modèles supplémentaires", additionalDetails: "Détails supplémentaires", baseModelDescription: "Le modèle de base a été entraîné et affiné sur un mélange de langage naturel et de données de code dans plusieurs langues. Les modèles supplémentaires peuvent être utilisés pour effectuer des actions." }, Vb = { hideSteps: "Masquer les étapes", showSteps: "Afficher les étapes", hideScratchpad: "Masquer le bloc-notes", showScratchpad: "Afficher le bloc-notes", chatSessionId: "ID de session de chat", requestId: "ID de requête", debug: "Déboguer" }, Kb = { send: "Envoyer", uploadingFiles: "Téléchargement de fichiers...", addImage: "Ajouter une image", removeFile: "Supprimer le fichier", placeholder: `Comment puis-je vous aider ?

💡 Conseil : Plus vous êtes précis, mieux je peux vous aider !
Utilisez @ pour ajouter des fichiers, utilisez / pour lister les commandes` }, Jb = { mainDescription: "Créez, modifiez ou supprimez des en-têtes HTTP personnalisés et leurs valeurs associées. Ces en-têtes seront appliqués à toutes les requêtes API sortantes.", showBestPractices: "Afficher les meilleures pratiques", bestPractice1: "Utilisez toujours les noms d'en-tête, les valeurs d'en-tête et l'URL d'hôte API exacts et corrects. Des valeurs incorrectes ou mal formées peuvent provoquer des erreurs dans l'interface utilisateur, faire échouer les requêtes API ou apparaître vides sans diagnostics.", bestPractice2: "Les en-têtes personnalisés non autorisés par le backend peuvent déclencher des échecs CORS, empêchant le chargement de l'interface utilisateur.", bestPractice3: "Testez vos appels API au préalable à l'aide d'un outil externe tel que curl pour confirmer que les valeurs fonctionnent avant de les appliquer ici.", bestPractice4: "Soyez prêt à réinitialiser le stockage local aux valeurs par défaut manuellement si une mauvaise configuration casse l'interface utilisateur ou si les valeurs expirent. Cela peut être fait via la console de développeur de votre navigateur localStorage.removeItem ('custom_host_url') localStorage.removeItem ('custom_http_headers').", securityNoteTitle: "Note de Sécurité", securityNoteSubtitle: "Les informations sont stockées localement dans votre navigateur et persistent jusqu'à ce qu'elles soient effacées manuellement ou supprimées par le navigateur. Parce qu'elles peuvent contenir des données sensibles, elles ne doivent être utilisées qu'à des fins de développement. Utilisez à votre propre discrétion.", warningStatus: "Avertissement", apiHostUrlLabel: "URL d'Hôte API (Optionnel)", apiHostUrlPlaceholder: "ex., https://api.example.com", apiHostUrlHelper: "Remplacez l'URL d'hôte API par défaut. Laissez vide pour utiliser la configuration par défaut.", ibmHeadersTitle: "En-têtes IBM (Remplacements Optionnels)", ibmHeadersDescription: "Remplacez les valeurs d'en-tête IBM par défaut. Laissez vide pour utiliser les valeurs par défaut du système.", keyLabel: "Clé", valueLabel: "Valeur", clearHeaderTooltip: "Effacer cet en-tête", validationErrorTitle: "Erreur de Validation", incompleteHeadersError: "Toutes les lignes d'en-tête doivent avoir à la fois la clé et la valeur remplies, ou laisser les deux vides pour ignorer.", invalidHeaderKeysError: `Clé(s) d'en-tête non valide(s) : {{keys}}. Toutes les clés d'en-tête personnalisées doivent commencer par "x-ibm-" (insensible à la casse).`, customHeadersTitle: "En-têtes Personnalisés Supplémentaires", customHeadersDescription: `Ajoutez tous les en-têtes X-ibm- supplémentaires qui ne sont pas listés ci-dessus. Toutes les clés d'en-tête personnalisées doivent commencer par "X-ibm-".`, customHeaderLegend: "En-tête de requête personnalisé {{number}}", keyPlaceholder: "ex., X-ibm-custom-header", valuePlaceholder: "ex., custom-value", deleteHeaderTooltip: "Supprimer l'en-tête", noCustomHeaders: "Il n'y a pas d'en-têtes personnalisés définis", addHeaderButton: "Ajouter un en-tête", testingButton: "Test en cours...", testApiButton: "Tester la Connexion API", connectionSuccessTitle: "Connexion Réussie", connectionFailedTitle: "Connexion Échouée", successStatus: "Succès", errorStatus: "Erreur", successMessage: "Succès ! Statut : {{status}} {{statusText}}", failedMessage: "Échec avec le statut {{status}} {{statusText}}", requestFailedMessage: "La requête a échoué{{statusInfo}} : {{error}}", headersSavedTitle: "En-têtes Enregistrés", noHeadersSavedTitle: "Aucun En-tête Enregistré", savedSuccessMessage: "{{items}} {{verb}} enregistré avec succès.", noItemsSavedMessage: "Aucun en-tête ou URL d'hôte n'a été enregistré. Tous les champs étaient vides ou supprimés.", noHeadersSavedMessage: "Aucun en-tête n'a été enregistré. Tous les champs étaient vides ou supprimés.", headerText: "en-tête", headersText: "en-têtes", hostUrlText: "URL d'hôte", cancelButton: "Annuler", saveChangesButton: "Enregistrer les modifications", selectAgentTypeLabel: "Sélectionner le type d'agent", agentHeadersTitle: "En-têtes {{agent}} (Remplacements optionnels)", agentHeadersDescription: "Remplacer les valeurs d'en-tête {{agent}} par défaut. Laisser vide pour utiliser les valeurs par défaut du système.", generateMcspTokenButton: "Générer un jeton MCSP", authorizationDescription: "Token Bearer pour l'authentification", authorizationPlaceholder: "Bearer <votre-token>", userIdDescription: "ID utilisateur", orgIdDescription: "ID d'organisation fournisseur", frontendContextDescription: 'Chaîne JSON avec contexte frontend. Exemple : {"key": "value"}', authContextDescription: `Chaîne JSON avec contexte d'authentification. Exemple : {"auth_values": {"mcpSecrets": {...}}}`, tokenGenerated: "Jeton généré" }, Zb = { generic: "Quelque chose s'est mal passé", network: "Erreur réseau. Veuillez vérifier votre connexion.", timeout: "Délai d'attente dépassé. Veuillez réessayer.", unauthorized: "Non autorisé. Veuillez vous connecter.", notFound: "Ressource introuvable", serverError: "Erreur du serveur. Veuillez réessayer plus tard." }, Yb = { required: "Ce champ est obligatoire", invalidEmail: "Adresse e-mail invalide", minLength: "La longueur minimale est de {{min}} caractères", maxLength: "La longueur maximale est de {{max}} caractères" }, Qb = {
  common: jb,
  landingPage: $b,
  welcomeMessage: qb,
  chat: Wb,
  chatPane: Gb,
  toolbar: Xb,
  messageHeader: Vb,
  promptInput: Kb,
  updateHeaders: Jb,
  errors: Zb,
  validation: Yb
}, e0 = { welcome: "Willkommen", loading: "Laden...", error: "Fehler", success: "Erfolg", cancel: "Abbrechen", submit: "Absenden", save: "Speichern", delete: "Löschen", edit: "Bearbeiten", close: "Schließen", search: "Suchen", filter: "Filtern", clear: "Löschen", back: "Zurück", next: "Weiter", previous: "Vorherige", confirm: "Bestätigen", yes: "Ja", no: "Nein" }, t0 = { apiSettings: "API-Einstellungen", apiSettingsDescription: "Header und Host-URL konfigurieren", newChat: "Neuer Chat", recentChats: "Letzte Chats", noConversations: "Noch keine Gespräche", clickNewChat: "Klicken Sie auf Neuer Chat, um zu beginnen", emptyChat: "Leerer Chat", errorFetchingChats: "Fehler beim Abrufen der Chats", configureApiSettings: "API-Einstellungen konfigurieren" }, r0 = { apiAgentGreeting: "Hallo! Ich bin Ihr API-Agent. Sie sind jetzt mit der API Connect-Anbieterorganisation {{porg}} verbunden.", exploreCommands: 'Erkunden Sie Schnellbefehle, indem Sie "/" in die Befehlszeile eingeben. Hier sind einige Aufgaben, bei denen ich helfen kann:', limitations: "Es gibt einige Einschränkungen bei dem, was ich heute tun kann. Weitere Informationen finden Sie unter", sampleAgentGreeting: "Hallo! Ich bin Ihr Beispiel-Agent. Sie können jetzt mit diesem Agenten experimentieren.", createApi: "API erstellen", publishApi: "API veröffentlichen", queryAnalytics: "Analysen abfragen", searchApis: "APIs suchen", useSampleTools: "ARIA-Beispieltools verwenden", experimentCapabilities: "Mit ARIA Framework-Funktionen experimentieren" }, n0 = { placeholder: "Geben Sie Ihre Nachricht ein...", send: "Senden", newChat: "Neuer Chat", clearHistory: "Verlauf löschen", exportChat: "Chat exportieren", copyMessage: "Nachricht kopieren", regenerate: "Regenerieren", stop: "Stoppen", thinking: "Denken...", typing: "Tippen...", samplePrompts: "Beispielaufforderungen", unknownFile: "Unbekannte Datei", languageNotificationMessage: "Sobald ein Chat beginnt, kann seine Sprache nicht mehr geändert werden. Um in einer anderen Sprache zu chatten, wählen Sie eine aus und starten Sie einen neuen Chat.", selectLanguage: "Wählen Sie Ihre Sprache" }, a0 = { errorCreatingChat: "Fehler beim Erstellen eines neuen Chats", errorFetchingChat: "Fehler beim Abrufen der Chats", errorProcessingSelection: "Fehler bei der Verarbeitung der Auswahl", errorProcessingAttachments: "Fehler bei der Verarbeitung von Dateianhängen", errorSendingMessage: "Fehler beim Senden der Nachricht", streamingError: "Streaming-Fehler aufgetreten", disclaimerAccuracy: "Die Genauigkeit der generierten Antworten kann variieren.", disclaimerDoubleCheck: "Bitte überprüfen Sie die Antworten.", uploadedSuccessfully: "Erfolgreich hochgeladen:" }, s0 = { backToChats: "Zurück zu Chats", samplePrompts: "Beispielaufforderungen", newChat: "Neuer Chat", switchOrganization: "Organisation wechseln", updateHttpHeaders: "HTTP-Header aktualisieren", logout: "Abmelden", aiExplained: "KI erklärt", aiAgent: "KI-Agent", accelerateDevelopment: "Beschleunigen Sie die Entwicklung mit KI, um Teile des API-Lebenszyklus-Managements zu optimieren.", howItWorks: "So funktioniert es", aiCanAssist: "KI kann bei der API-Erstellung, -Veröffentlichung und -Tests helfen. KI nutzt vorhandene Quellen in API Connect zur Unterstützung.", analyze: "Analysieren:", analyzeDescription: "KI kann Sie unterstützen, indem sie Benutzereingaben analysiert und geeignete Tools verwendet, um Ihre Anfrage auszuführen.", recommend: "Empfehlen:", recommendDescription: "KI antwortet mithilfe trainierter Modelle, um relevante Antworten zu liefern.", baseAiModels: "Basis-KI-Modelle", additionalModels: "Zusätzliche Modelle", additionalDetails: "Zusätzliche Details", baseModelDescription: "Das Basismodell wurde auf einer Mischung aus natürlicher Sprache und Code-Daten in mehreren Sprachen trainiert und feinabgestimmt. Die zusätzlichen Modelle können zur Durchführung von Aktionen verwendet werden." }, o0 = { hideSteps: "Schritte ausblenden", showSteps: "Schritte anzeigen", hideScratchpad: "Notizblock ausblenden", showScratchpad: "Notizblock anzeigen", chatSessionId: "Chat-Sitzungs-ID", requestId: "Anfrage-ID", debug: "Debuggen" }, i0 = { send: "Senden", uploadingFiles: "Dateien werden hochgeladen...", addImage: "Bild hinzufügen", removeFile: "Datei entfernen", placeholder: `Wie kann ich Ihnen helfen?

💡 Tipp: Je spezifischer Sie sind, desto besser kann ich helfen!
Verwenden Sie @ zum Hinzufügen von Dateien, verwenden Sie / zum Auflisten von Befehlen` }, l0 = { mainDescription: "Erstellen, bearbeiten oder löschen Sie benutzerdefinierte HTTP-Header und deren zugehörige Werte. Diese Header werden auf alle ausgehenden API-Anfragen angewendet.", showBestPractices: "Best Practices anzeigen", bestPractice1: "Verwenden Sie immer die exakten und korrekten Header-Namen, Header-Werte und API-Host-URL. Falsche oder fehlerhafte Werte können UI-Fehler verursachen, API-Anfragen fehlschlagen lassen oder leer ohne Diagnose erscheinen.", bestPractice2: "Benutzerdefinierte Header, die vom Backend nicht autorisiert sind, können CORS-Fehler auslösen und verhindern, dass die UI geladen wird.", bestPractice3: "Testen Sie Ihre API-Aufrufe im Voraus mit einem externen Tool wie curl, um zu bestätigen, dass die Werte funktionieren, bevor Sie sie hier anwenden.", bestPractice4: "Seien Sie bereit, den lokalen Speicher manuell auf Standardwerte zurückzusetzen, wenn eine Fehlkonfiguration die UI beschädigt oder Werte ablaufen. Dies kann über die Entwicklerkonsole Ihres Browsers erfolgen localStorage.removeItem('custom_host_url') localStorage.removeItem('custom_http_headers').", securityNoteTitle: "Sicherheitshinweis", securityNoteSubtitle: "Informationen werden lokal in Ihrem Browser gespeichert und bleiben bestehen, bis sie manuell gelöscht oder vom Browser entfernt werden. Da sie sensible Daten enthalten können, sollten sie nur für Entwicklungszwecke verwendet werden. Verwenden Sie sie auf eigenes Risiko.", warningStatus: "Warnung", apiHostUrlLabel: "API-Host-URL (Optional)", apiHostUrlPlaceholder: "z.B. https://api.example.com", apiHostUrlHelper: "Überschreiben Sie die Standard-API-Host-URL. Leer lassen, um die Standardkonfiguration zu verwenden.", ibmHeadersTitle: "IBM-Header (Optionale Überschreibungen)", ibmHeadersDescription: "Überschreiben Sie die Standard-IBM-Header-Werte. Leer lassen, um Systemstandards zu verwenden.", keyLabel: "Schlüssel", valueLabel: "Wert", clearHeaderTooltip: "Diesen Header löschen", validationErrorTitle: "Validierungsfehler", incompleteHeadersError: "Alle Header-Zeilen müssen sowohl Schlüssel als auch Wert ausgefüllt haben oder beide leer lassen zum Überspringen.", invalidHeaderKeysError: 'Ungültige Header-Schlüssel: {{keys}}. Alle benutzerdefinierten Header-Schlüssel müssen mit "x-ibm-" beginnen (Groß-/Kleinschreibung wird nicht beachtet).', customHeadersTitle: "Zusätzliche Benutzerdefinierte Header", customHeadersDescription: 'Fügen Sie alle zusätzlichen X-ibm- Header hinzu, die oben nicht aufgeführt sind. Alle benutzerdefinierten Header-Schlüssel müssen mit "X-ibm-" beginnen.', customHeaderLegend: "Benutzerdefinierter Anfrage-Header {{number}}", keyPlaceholder: "z.B. X-ibm-custom-header", valuePlaceholder: "z.B. custom-value", deleteHeaderTooltip: "Header löschen", noCustomHeaders: "Es sind keine benutzerdefinierten Header definiert", addHeaderButton: "Header hinzufügen", testingButton: "Wird getestet...", testApiButton: "API-Verbindung testen", connectionSuccessTitle: "Verbindung erfolgreich", connectionFailedTitle: "Verbindung fehlgeschlagen", successStatus: "Erfolg", errorStatus: "Fehler", successMessage: "Erfolg! Status: {{status}} {{statusText}}", failedMessage: "Fehlgeschlagen mit Status {{status}} {{statusText}}", requestFailedMessage: "Anfrage fehlgeschlagen{{statusInfo}}: {{error}}", headersSavedTitle: "Header gespeichert", noHeadersSavedTitle: "Keine Header gespeichert", savedSuccessMessage: "{{items}} {{verb}} erfolgreich gespeichert.", noItemsSavedMessage: "Keine Header oder Host-URL wurden gespeichert. Alle Felder waren leer oder entfernt.", noHeadersSavedMessage: "Keine Header wurden gespeichert. Alle Felder waren leer oder entfernt.", headerText: "Header", headersText: "Header", hostUrlText: "Host-URL", cancelButton: "Abbrechen", saveChangesButton: "Änderungen speichern", selectAgentTypeLabel: "Agententyp auswählen", agentHeadersTitle: "{{agent}}-Header (Optionale Überschreibungen)", agentHeadersDescription: "Standard-{{agent}}-Header-Werte überschreiben. Leer lassen, um Systemstandards zu verwenden.", generateMcspTokenButton: "MCSP-Token generieren", authorizationDescription: "Bearer-Token für Authentifizierung", authorizationPlaceholder: "Bearer <ihr-token>", userIdDescription: "Benutzer-ID", orgIdDescription: "Anbieter-Organisations-ID", frontendContextDescription: 'JSON-String mit Frontend-Kontext. Beispiel: {"key": "value"}', authContextDescription: 'JSON-String mit Authentifizierungskontext. Beispiel: {"auth_values": {"mcpSecrets": {...}}}', tokenGenerated: "Token generiert" }, c0 = { generic: "Etwas ist schief gelaufen", network: "Netzwerkfehler. Bitte überprüfen Sie Ihre Verbindung.", timeout: "Zeitüberschreitung. Bitte versuchen Sie es erneut.", unauthorized: "Nicht autorisiert. Bitte melden Sie sich an.", notFound: "Ressource nicht gefunden", serverError: "Serverfehler. Bitte versuchen Sie es später erneut." }, u0 = { required: "Dieses Feld ist erforderlich", invalidEmail: "Ungültige E-Mail-Adresse", minLength: "Mindestlänge beträgt {{min}} Zeichen", maxLength: "Maximale Länge beträgt {{max}} Zeichen" }, d0 = {
  common: e0,
  landingPage: t0,
  welcomeMessage: r0,
  chat: n0,
  chatPane: a0,
  toolbar: s0,
  messageHeader: o0,
  promptInput: i0,
  updateHeaders: l0,
  errors: c0,
  validation: u0
}, h0 = { welcome: "ようこそ", loading: "読み込み中...", error: "エラー", success: "成功", cancel: "キャンセル", submit: "送信", save: "保存", delete: "削除", edit: "編集", close: "閉じる", search: "検索", filter: "フィルター", clear: "クリア", back: "戻る", next: "次へ", previous: "前へ", confirm: "確認", yes: "はい", no: "いいえ" }, p0 = { apiSettings: "API設定", apiSettingsDescription: "ヘッダーとホストURLを設定", newChat: "新しいチャット", recentChats: "最近のチャット", noConversations: "まだ会話がありません", clickNewChat: "新しいチャットをクリックして開始", emptyChat: "空のチャット", errorFetchingChats: "チャットの取得中にエラーが発生しました", configureApiSettings: "API設定を構成" }, f0 = { apiAgentGreeting: "こんにちは！私はあなたのAPIエージェントです。API Connectプロバイダー組織{{porg}}に接続されました。", exploreCommands: 'プロンプト行に"/"と入力してクイックコマンドを探索してください。お手伝いできるタスクは次のとおりです：', limitations: "今日できることにはいくつかの制限があります。詳細については、こちらをご覧ください", sampleAgentGreeting: "こんにちは！私はあなたのサンプルエージェントです。このエージェントで実験できます。", createApi: "APIを作成", publishApi: "APIを公開", queryAnalytics: "分析をクエリ", searchApis: "APIを検索", useSampleTools: "ARIAサンプルツールを使用", experimentCapabilities: "ARIAフレームワーク機能を試す" }, m0 = { placeholder: "メッセージを入力...", send: "送信", newChat: "新しいチャット", clearHistory: "履歴をクリア", exportChat: "チャットをエクスポート", copyMessage: "メッセージをコピー", regenerate: "再生成", stop: "停止", thinking: "考え中...", typing: "入力中...", samplePrompts: "サンプルプロンプト", unknownFile: "不明なファイル", languageNotificationMessage: "チャットが開始されると、その言語は変更できません。別の言語でチャットするには、言語を選択して新しいチャットを開始してください。", selectLanguage: "言語を選択してください" }, g0 = { errorCreatingChat: "新しいチャットの作成中にエラーが発生しました", errorFetchingChat: "チャットの取得中にエラーが発生しました", errorProcessingSelection: "選択の処理中にエラーが発生しました", errorProcessingAttachments: "ファイル添付の処理中にエラーが発生しました", errorSendingMessage: "メッセージの送信中にエラーが発生しました", streamingError: "ストリーミングエラーが発生しました", disclaimerAccuracy: "生成された回答の精度は異なる場合があります。", disclaimerDoubleCheck: "回答を再確認してください。", uploadedSuccessfully: "正常にアップロードされました：" }, v0 = { backToChats: "チャットに戻る", samplePrompts: "サンプルプロンプト", newChat: "新しいチャット", switchOrganization: "組織を切り替え", updateHttpHeaders: "HTTPヘッダーを更新", logout: "ログアウト", aiExplained: "AI説明", aiAgent: "AIエージェント", accelerateDevelopment: "AIを使用して開発を加速し、APIライフサイクル管理の一部を効率化します。", howItWorks: "仕組み", aiCanAssist: "AIは、API作成、公開、テストを支援できます。AIは、API Connectの既存のソースを活用して支援します。", analyze: "分析：", analyzeDescription: "AIは、ユーザー入力を分析し、適切なツールを使用してリクエストを実行することで支援できます。", recommend: "推奨：", recommendDescription: "AIは、トレーニング済みモデルを使用して関連する回答を提供することで応答します。", baseAiModels: "ベースAIモデル", additionalModels: "追加モデル", additionalDetails: "追加の詳細", baseModelDescription: "ベースモデルは、複数の言語の自然言語とコードデータの組み合わせでトレーニングおよび微調整されました。追加のモデルは、アクションを実行するために使用される場合があります。" }, y0 = { hideSteps: "ステップを非表示", showSteps: "ステップを表示", hideScratchpad: "スクラッチパッドを非表示", showScratchpad: "スクラッチパッドを表示", chatSessionId: "チャットセッションID", requestId: "リクエストID", debug: "デバッグ" }, b0 = { send: "送信", uploadingFiles: "ファイルをアップロード中...", addImage: "画像を追加", removeFile: "ファイルを削除", placeholder: `どのようにお手伝いできますか？

💡 ヒント：具体的に指定するほど、より良いサポートができます！
@を使用してファイルを追加、/を使用してコマンドを一覧表示` }, w0 = { mainDescription: "カスタムHTTPヘッダーとその関連値を作成、編集、または削除します。これらのヘッダーはすべての送信API要求に適用されます。", showBestPractices: "ベストプラクティスを表示", bestPractice1: "常に正確で正しいヘッダー名、ヘッダー値、APIホストURLを使用してください。不正確または不正な値は、UIエラーを引き起こし、API要求を失敗させたり、診断なしで空白に表示されたりする可能性があります。", bestPractice2: "バックエンドで承認されていないカスタムヘッダーは、CORSエラーをトリガーし、UIの読み込みを妨げる可能性があります。", bestPractice3: "ここで適用する前に、curlなどの外部ツールを使用してAPI呼び出しを事前にテストし、値が機能することを確認してください。", bestPractice4: "誤った設定がUIを破壊したり、値が期限切れになったりした場合は、ローカルストレージを手動でデフォルト値にリセットする準備をしてください。これは、ブラウザの開発者コンソールlocalStorage.removeItem('custom_host_url') localStorage.removeItem('custom_http_headers')を介して実行できます。", securityNoteTitle: "セキュリティに関する注意", securityNoteSubtitle: "情報はブラウザにローカルに保存され、手動でクリアされるか、ブラウザによって削除されるまで保持されます。機密データが含まれる可能性があるため、開発目的でのみ使用してください。自己責任で使用してください。", warningStatus: "警告", apiHostUrlLabel: "APIホストURL（オプション）", apiHostUrlPlaceholder: "例：https://api.example.com", apiHostUrlHelper: "デフォルトのAPIホストURLを上書きします。デフォルト設定を使用するには空白のままにします。", ibmHeadersTitle: "IBMヘッダー（オプションの上書き）", ibmHeadersDescription: "デフォルトのIBMヘッダー値を上書きします。システムのデフォルトを使用するには空白のままにします。", keyLabel: "キー", valueLabel: "値", clearHeaderTooltip: "このヘッダーをクリア", validationErrorTitle: "検証エラー", incompleteHeadersError: "すべてのヘッダー行にはキーと値の両方を入力するか、スキップするには両方を空白のままにする必要があります。", invalidHeaderKeysError: "無効なヘッダーキー：{{keys}}。すべてのカスタムヘッダーキーは「x-ibm-」で始まる必要があります（大文字と小文字を区別しません）。", customHeadersTitle: "追加のカスタムヘッダー", customHeadersDescription: "上記にリストされていない追加のX-ibm-ヘッダーを追加します。すべてのカスタムヘッダーキーは「X-ibm-」で始まる必要があります。", customHeaderLegend: "カスタムリクエストヘッダー {{number}}", keyPlaceholder: "例：X-ibm-custom-header", valuePlaceholder: "例：custom-value", deleteHeaderTooltip: "ヘッダーを削除", noCustomHeaders: "カスタムヘッダーが定義されていません", addHeaderButton: "ヘッダーを追加", testingButton: "テスト中...", testApiButton: "API接続をテスト", connectionSuccessTitle: "接続成功", connectionFailedTitle: "接続失敗", successStatus: "成功", errorStatus: "エラー", successMessage: "成功！ステータス：{{status}} {{statusText}}", failedMessage: "ステータス {{status}} {{statusText}} で失敗しました", requestFailedMessage: "リクエストが失敗しました{{statusInfo}}：{{error}}", headersSavedTitle: "ヘッダーが保存されました", noHeadersSavedTitle: "ヘッダーが保存されていません", savedSuccessMessage: "{{items}} {{verb}} が正常に保存されました。", noItemsSavedMessage: "ヘッダーまたはホストURLは保存されませんでした。すべてのフィールドが空白または削除されました。", noHeadersSavedMessage: "ヘッダーは保存されませんでした。すべてのフィールドが空白または削除されました。", headerText: "ヘッダー", headersText: "ヘッダー", hostUrlText: "ホストURL", cancelButton: "キャンセル", saveChangesButton: "変更を保存", selectAgentTypeLabel: "エージェントタイプを選択", agentHeadersTitle: "{{agent}}ヘッダー（オプションの上書き）", agentHeadersDescription: "デフォルトの{{agent}}ヘッダー値を上書きします。システムのデフォルトを使用する場合は空のままにしてください。", generateMcspTokenButton: "MCSPトークンを生成", authorizationDescription: "認証用のBearerトークン", authorizationPlaceholder: "Bearer <your-token>", userIdDescription: "ユーザーID", orgIdDescription: "プロバイダー組織ID", frontendContextDescription: 'フロントエンドコンテキストを含むJSON文字列。例：{"key": "value"}', authContextDescription: '認証コンテキストを含むJSON文字列。例：{"auth_values": {"mcpSecrets": {...}}}', tokenGenerated: "トークンが生成されました" }, A0 = { generic: "問題が発生しました", network: "ネットワークエラー。接続を確認してください。", timeout: "リクエストがタイムアウトしました。もう一度お試しください。", unauthorized: "認証されていません。ログインしてください。", notFound: "リソースが見つかりません", serverError: "サーバーエラー。後でもう一度お試しください。" }, _0 = { required: "この項目は必須です", invalidEmail: "無効なメールアドレス", minLength: "最小長は{{min}}文字です", maxLength: "最大長は{{max}}文字です" }, C0 = {
  common: h0,
  landingPage: p0,
  welcomeMessage: f0,
  chat: m0,
  chatPane: g0,
  toolbar: v0,
  messageHeader: y0,
  promptInput: b0,
  updateHeaders: w0,
  errors: A0,
  validation: _0
}, x0 = { welcome: "欢迎", loading: "加载中...", error: "错误", success: "成功", cancel: "取消", submit: "提交", save: "保存", delete: "删除", edit: "编辑", close: "关闭", search: "搜索", filter: "筛选", clear: "清除", back: "返回", next: "下一步", previous: "上一步", confirm: "确认", yes: "是", no: "否" }, S0 = { apiSettings: "API设置", apiSettingsDescription: "配置标头和主机URL", newChat: "新对话", recentChats: "最近的对话", noConversations: "还没有对话", clickNewChat: "点击新对话开始", emptyChat: "空对话", errorFetchingChats: "获取对话时出错", configureApiSettings: "配置API设置" }, I0 = { apiAgentGreeting: "你好！我是你的API代理。你现在已连接到API Connect提供商组织{{porg}}。", exploreCommands: '在提示行中输入"/"来探索快速命令。以下是我可以帮助的一些任务：', limitations: "我今天能做的事情有一些限制。有关更多信息，请参阅", sampleAgentGreeting: "你好！我是你的示例代理。你现在可以使用此代理进行实验。", createApi: "创建API", publishApi: "发布API", queryAnalytics: "查询分析", searchApis: "搜索API", useSampleTools: "使用ARIA示例工具", experimentCapabilities: "试验ARIA框架功能" }, k0 = { placeholder: "输入您的消息...", send: "发送", newChat: "新对话", clearHistory: "清除历史", exportChat: "导出对话", copyMessage: "复制消息", regenerate: "重新生成", stop: "停止", thinking: "思考中...", typing: "输入中...", samplePrompts: "示例提示", unknownFile: "未知文件", languageNotificationMessage: "一旦聊天开始，其语言将无法更改。要使用不同的语言聊天，请选择一种语言并开始新的聊天。", selectLanguage: "选择您的语言" }, P0 = { errorCreatingChat: "创建新对话时出错", errorFetchingChat: "获取对话时出错", errorProcessingSelection: "处理选择时出错", errorProcessingAttachments: "处理文件附件时出错", errorSendingMessage: "发送消息时出错", streamingError: "发生流式传输错误", disclaimerAccuracy: "生成答案的准确性可能会有所不同。", disclaimerDoubleCheck: "请仔细检查回复。", uploadedSuccessfully: "上传成功：" }, T0 = { backToChats: "返回对话", samplePrompts: "示例提示", newChat: "新对话", switchOrganization: "切换组织", updateHttpHeaders: "更新HTTP标头", logout: "登出", aiExplained: "AI说明", aiAgent: "AI代理", accelerateDevelopment: "使用AI加速开发，帮助简化API生命周期管理的部分内容。", howItWorks: "工作原理", aiCanAssist: "AI可以协助API创建、发布和测试。AI利用API Connect中的现有资源提供帮助。", analyze: "分析：", analyzeDescription: "AI可以通过分析用户输入并使用适当的工具来执行您的请求来为您提供帮助。", recommend: "推荐：", recommendDescription: "AI通过使用训练的模型提供相关答案来响应。", baseAiModels: "基础AI模型", additionalModels: "附加模型", additionalDetails: "附加详细信息", baseModelDescription: "基础模型在多种语言的自然语言和代码数据混合上进行了训练和微调。附加模型可能用于执行操作。" }, E0 = { hideSteps: "隐藏步骤", showSteps: "显示步骤", hideScratchpad: "隐藏草稿板", showScratchpad: "显示草稿板", chatSessionId: "对话会话ID", requestId: "请求ID", debug: "调试" }, N0 = { send: "发送", uploadingFiles: "正在上传文件...", addImage: "添加图片", removeFile: "删除文件", placeholder: `我能帮您什么？

💡 提示：您越具体，我就能更好地帮助您！
使用@添加文件，使用/列出命令` }, H0 = { mainDescription: "创建、编辑或删除自定义HTTP标头及其关联值。这些标头将应用于所有传出的API请求。", showBestPractices: "显示最佳实践", bestPractice1: "始终使用准确和正确的标头名称、标头值和API主机URL。不正确或格式错误的值可能导致UI错误、API请求失败或显示为空白而没有诊断信息。", bestPractice2: "后端未授权的自定义标头可能触发CORS错误，阻止UI加载。", bestPractice3: "在此处应用之前，使用curl等外部工具预先测试您的API调用，以确认值是否有效。", bestPractice4: "如果错误配置破坏了UI或值过期，请准备手动将本地存储重置为默认值。这可以通过浏览器的开发者控制台localStorage.removeItem('custom_host_url') localStorage.removeItem('custom_http_headers')完成。", securityNoteTitle: "安全提示", securityNoteSubtitle: "信息本地存储在您的浏览器中，并持续存在，直到手动清除或被浏览器删除。由于它们可能包含敏感数据，因此仅应用于开发目的。使用风险自负。", warningStatus: "警告", apiHostUrlLabel: "API主机URL（可选）", apiHostUrlPlaceholder: "例如：https://api.example.com", apiHostUrlHelper: "覆盖默认的API主机URL。留空以使用默认配置。", ibmHeadersTitle: "IBM标头（可选覆盖）", ibmHeadersDescription: "覆盖默认的IBM标头值。留空以使用系统默认值。", keyLabel: "键", valueLabel: "值", clearHeaderTooltip: "清除此标头", validationErrorTitle: "验证错误", incompleteHeadersError: "所有标头行必须同时填写键和值，或将两者都留空以跳过。", invalidHeaderKeysError: '无效的标头键：{{keys}}。所有自定义标头键必须以"x-ibm-"开头（不区分大小写）。', customHeadersTitle: "其他自定义标头", customHeadersDescription: '添加上面未列出的任何其他X-ibm-标头。所有自定义标头键必须以"X-ibm-"开头。', customHeaderLegend: "自定义请求标头 {{number}}", keyPlaceholder: "例如：X-ibm-custom-header", valuePlaceholder: "例如：custom-value", deleteHeaderTooltip: "删除标头", noCustomHeaders: "没有定义自定义标头", addHeaderButton: "添加标头", testingButton: "测试中...", testApiButton: "测试API连接", connectionSuccessTitle: "连接成功", connectionFailedTitle: "连接失败", successStatus: "成功", errorStatus: "错误", successMessage: "成功！状态：{{status}} {{statusText}}", failedMessage: "失败，状态 {{status}} {{statusText}}", requestFailedMessage: "请求失败{{statusInfo}}：{{error}}", headersSavedTitle: "标头已保存", noHeadersSavedTitle: "未保存标头", savedSuccessMessage: "{{items}} {{verb}} 已成功保存。", noItemsSavedMessage: "未保存任何标头或主机URL。所有字段均为空或已删除。", noHeadersSavedMessage: "未保存任何标头。所有字段均为空或已删除。", headerText: "标头", headersText: "标头", hostUrlText: "主机URL", cancelButton: "取消", saveChangesButton: "保存更改", selectAgentTypeLabel: "选择代理类型", agentHeadersTitle: "{{agent}}标头（可选覆盖）", agentHeadersDescription: "覆盖默认的{{agent}}标头值。留空以使用系统默认值。", generateMcspTokenButton: "生成MCSP令牌", authorizationDescription: "用于身份验证的Bearer令牌", authorizationPlaceholder: "Bearer <your-token>", userIdDescription: "用户ID", orgIdDescription: "提供商组织ID", frontendContextDescription: '包含前端上下文的JSON字符串。示例：{"key": "value"}', authContextDescription: '包含身份验证上下文的JSON字符串。示例：{"auth_values": {"mcpSecrets": {...}}}', tokenGenerated: "令牌已生成" }, M0 = { generic: "出现问题", network: "网络错误。请检查您的连接。", timeout: "请求超时。请重试。", unauthorized: "未授权。请登录。", notFound: "未找到资源", serverError: "服务器错误。请稍后重试。" }, D0 = { required: "此字段为必填项", invalidEmail: "无效的电子邮件地址", minLength: "最小长度为{{min}}个字符", maxLength: "最大长度为{{max}}个字符" }, R0 = {
  common: x0,
  landingPage: S0,
  welcomeMessage: I0,
  chat: k0,
  chatPane: P0,
  toolbar: T0,
  messageHeader: E0,
  promptInput: N0,
  updateHeaders: H0,
  errors: M0,
  validation: D0
}, z0 = { welcome: "Bem-vindo", loading: "Carregando...", error: "Erro", success: "Sucesso", cancel: "Cancelar", submit: "Enviar", save: "Salvar", delete: "Excluir", edit: "Editar", close: "Fechar", search: "Pesquisar", filter: "Filtrar", clear: "Limpar", back: "Voltar", next: "Próximo", previous: "Anterior", confirm: "Confirmar", yes: "Sim", no: "Não" }, L0 = { apiSettings: "Configurações da API", apiSettingsDescription: "Configurar cabeçalhos e URL do host", newChat: "Nova conversa", recentChats: "Conversas recentes", noConversations: "Ainda não há conversas", clickNewChat: "Clique em Nova Conversa para começar", emptyChat: "Conversa vazia", errorFetchingChats: "Ocorreu um erro ao buscar conversas", configureApiSettings: "Configurar Definições da API" }, O0 = { apiAgentGreeting: "Olá! Sou seu Agente de API. Você está conectado à organização provedora do API Connect {{porg}}.", exploreCommands: 'Explore comandos rápidos digitando "/" na linha de prompt. Aqui estão algumas tarefas com as quais posso ajudar:', limitations: "Existem algumas limitações no que posso fazer hoje. Para mais informações, consulte", sampleAgentGreeting: "Olá! Sou seu Agente de Exemplo. Agora você pode experimentar este agente.", createApi: "Criar API", publishApi: "Publicar API", queryAnalytics: "Consultar Análises", searchApis: "Pesquisar APIs", useSampleTools: "Usar Ferramentas de Exemplo ARIA", experimentCapabilities: "Experimentar Capacidades do Framework ARIA" }, U0 = { placeholder: "Digite sua mensagem...", send: "Enviar", newChat: "Nova Conversa", clearHistory: "Limpar Histórico", exportChat: "Exportar Conversa", copyMessage: "Copiar Mensagem", regenerate: "Regenerar", stop: "Parar", thinking: "Pensando...", typing: "Digitando...", samplePrompts: "Prompts de exemplo", unknownFile: "Arquivo desconhecido", languageNotificationMessage: "Uma vez que um chat começa, seu idioma não pode ser alterado. Para conversar em um idioma diferente, selecione um e inicie um novo chat.", selectLanguage: "Selecione seu idioma" }, B0 = { errorCreatingChat: "Erro ao criar nova conversa", errorFetchingChat: "Ocorreu um erro ao buscar conversas", errorProcessingSelection: "Erro ao processar seleção", errorProcessingAttachments: "Erro ao processar anexos de arquivo", errorSendingMessage: "Erro ao enviar mensagem", streamingError: "Ocorreu um erro de streaming", disclaimerAccuracy: "A precisão das respostas geradas pode variar.", disclaimerDoubleCheck: "Por favor, verifique as respostas.", uploadedSuccessfully: "Enviado com sucesso:" }, F0 = { backToChats: "Voltar para conversas", samplePrompts: "Prompts de exemplo", newChat: "Nova conversa", switchOrganization: "Trocar organização", updateHttpHeaders: "Atualizar cabeçalhos HTTP", logout: "Sair", aiExplained: "IA explicada", aiAgent: "Agente de IA", accelerateDevelopment: "Acelere o desenvolvimento com IA para ajudar a simplificar partes do gerenciamento do ciclo de vida da API.", howItWorks: "Como funciona", aiCanAssist: "A IA pode auxiliar na criação, publicação e teste de APIs. A IA aproveita fontes existentes no API Connect para ajudar.", analyze: "Analisar:", analyzeDescription: "A IA pode ajudá-lo analisando entradas do usuário e usando ferramentas apropriadas para executar sua solicitação.", recommend: "Recomendar:", recommendDescription: "A IA responde usando modelos treinados para fornecer respostas relevantes.", baseAiModels: "Modelos de IA base", additionalModels: "Modelos adicionais", additionalDetails: "Detalhes adicionais", baseModelDescription: "O modelo base foi treinado e ajustado em uma mistura de dados de linguagem natural e código em vários idiomas. Os modelos adicionais podem ser usados para executar ações." }, j0 = { hideSteps: "Ocultar etapas", showSteps: "Mostrar etapas", hideScratchpad: "Ocultar rascunho", showScratchpad: "Mostrar rascunho", chatSessionId: "ID da sessão de conversa", requestId: "ID da solicitação", debug: "Depurar" }, $0 = { send: "Enviar", uploadingFiles: "Enviando arquivos...", addImage: "Adicionar imagem", removeFile: "Remover arquivo", placeholder: `Como posso ajudá-lo?

💡 Dica: Quanto mais específico você for, melhor posso ajudar!
Use @ para adicionar arquivos, use / para listar comandos` }, q0 = { mainDescription: "Crie, modifique ou remova cabeçalhos HTTP personalizados e seus valores associados. Esses cabeçalhos serão aplicados a todas as solicitações de API de saída.", showBestPractices: "Mostrar melhores práticas", bestPractice1: "Sempre use os nomes de cabeçalho, valores de cabeçalho e URL do host da API exatos e corretos. Valores incorretos ou malformados podem causar erro na interface do usuário, falha nas solicitações de API ou aparecer em branco sem diagnósticos.", bestPractice2: "Cabeçalhos personalizados não permitidos pelo backend podem acionar falhas de CORS, impedindo o carregamento da interface do usuário.", bestPractice3: "Teste suas chamadas de API antecipadamente usando uma ferramenta externa como curl para confirmar que os valores funcionam antes de aplicá-los aqui.", bestPractice4: "Esteja preparado para redefinir o armazenamento local para o padrão manualmente se uma configuração incorreta quebrar a interface do usuário ou os valores expirarem. Isso pode ser feito através do console do desenvolvedor do seu navegador localStorage.removeItem ('custom_host_url') localStorage.removeItem ('custom_http_headers').", securityNoteTitle: "Nota de Segurança", securityNoteSubtitle: "As informações são armazenadas localmente no seu navegador e persistem até serem limpas manualmente ou removidas pelo navegador. Como podem conter dados sensíveis, devem ser usadas apenas para fins de desenvolvimento. Use por sua conta e risco.", warningStatus: "Aviso", apiHostUrlLabel: "URL do Host da API (Opcional)", apiHostUrlPlaceholder: "ex., https://api.example.com", apiHostUrlHelper: "Substitua a URL do host da API padrão. Deixe vazio para usar a configuração padrão.", ibmHeadersTitle: "Cabeçalhos IBM (Substituições Opcionais)", ibmHeadersDescription: "Substitua os valores padrão dos cabeçalhos IBM. Deixe vazio para usar os padrões do sistema.", keyLabel: "Chave", valueLabel: "Valor", clearHeaderTooltip: "Limpar este cabeçalho", validationErrorTitle: "Erro de Validação", incompleteHeadersError: "Todas as linhas de cabeçalho devem ter chave e valor preenchidos, ou deixe ambos vazios para pular.", invalidHeaderKeysError: 'Chave(s) de cabeçalho inválida(s): {{keys}}. Todas as chaves de cabeçalho personalizadas devem começar com "x-ibm-" (não diferencia maiúsculas de minúsculas).', customHeadersTitle: "Cabeçalhos Personalizados Adicionais", customHeadersDescription: 'Adicione quaisquer cabeçalhos X-ibm- adicionais que não estejam listados acima. Todas as chaves de cabeçalho personalizadas devem começar com "X-ibm-".', customHeaderLegend: "Cabeçalho de solicitação personalizado {{number}}", keyPlaceholder: "ex., X-ibm-custom-header", valuePlaceholder: "ex., custom-value", deleteHeaderTooltip: "Excluir cabeçalho", noCustomHeaders: "Não há cabeçalhos personalizados definidos", addHeaderButton: "Adicionar cabeçalho", testingButton: "Testando...", testApiButton: "Testar Conexão da API", connectionSuccessTitle: "Conexão Bem-sucedida", connectionFailedTitle: "Conexão Falhou", successStatus: "Sucesso", errorStatus: "Erro", successMessage: "Sucesso! Status: {{status}} {{statusText}}", failedMessage: "Falhou com status {{status}} {{statusText}}", requestFailedMessage: "Solicitação falhou{{statusInfo}}: {{error}}", headersSavedTitle: "Cabeçalhos Salvos", noHeadersSavedTitle: "Nenhum Cabeçalho Salvo", savedSuccessMessage: "{{items}} {{verb}} salvo com sucesso.", noItemsSavedMessage: "Nenhum cabeçalho ou URL de host foi salvo. Todos os campos estavam vazios ou foram removidos.", noHeadersSavedMessage: "Nenhum cabeçalho foi salvo. Todos os campos estavam vazios ou foram removidos.", headerText: "cabeçalho", headersText: "cabeçalhos", hostUrlText: "URL do host", cancelButton: "Cancelar", saveChangesButton: "Salvar alterações", selectAgentTypeLabel: "Selecionar tipo de agente", agentHeadersTitle: "Cabeçalhos {{agent}} (Substituições opcionais)", agentHeadersDescription: "Substituir valores padrão de cabeçalhos {{agent}}. Deixe vazio para usar os padrões do sistema.", generateMcspTokenButton: "Gerar token MCSP", authorizationDescription: "Token Bearer para autenticação", authorizationPlaceholder: "Bearer <seu-token>", userIdDescription: "ID do usuário", orgIdDescription: "ID da organização provedora", frontendContextDescription: 'String JSON com contexto frontend. Exemplo: {"key": "value"}', authContextDescription: 'String JSON com contexto de autenticação. Exemplo: {"auth_values": {"mcpSecrets": {...}}}', tokenGenerated: "Token gerado" }, W0 = { generic: "Algo deu errado", network: "Erro de rede. Por favor, verifique sua conexão.", timeout: "Tempo limite da solicitação esgotado. Por favor, tente novamente.", unauthorized: "Não autorizado. Por favor, faça login.", notFound: "Recurso não encontrado", serverError: "Erro do servidor. Por favor, tente novamente mais tarde." }, G0 = { required: "Este campo é obrigatório", invalidEmail: "Endereço de e-mail inválido", minLength: "O comprimento mínimo é de {{min}} caracteres", maxLength: "O comprimento máximo é de {{max}} caracteres" }, X0 = {
  common: z0,
  landingPage: L0,
  welcomeMessage: O0,
  chat: U0,
  chatPane: B0,
  toolbar: F0,
  messageHeader: j0,
  promptInput: $0,
  updateHeaders: q0,
  errors: W0,
  validation: G0
}, V0 = {
  en: {
    translation: Tb
  },
  es: {
    translation: Fb
  },
  fr: {
    translation: Qb
  },
  de: {
    translation: d0
  },
  ja: {
    translation: C0
  },
  zh: {
    translation: R0
  },
  "pt-BR": {
    translation: X0
  }
};
Jt.use(ry).use(Vv).init({
  resources: V0,
  fallbackLng: "en",
  // Fallback language if detection fails
  debug: !1,
  // Set to true for development debugging
  // Language detection options
  detection: {
    // Order of detection methods
    order: ["navigator", "localStorage", "cookie", "querystring", "htmlTag"],
    // Cache user language preference
    caches: ["localStorage", "cookie"],
    // Cookie options
    cookieMinutes: 10080,
    // 7 days
    cookieDomain: void 0
  },
  // Interpolation options
  interpolation: {
    escapeValue: !1
    // React already escapes values
  },
  // React options
  react: {
    useSuspense: !1
    // Set to true if you want to use Suspense
  },
  // Supported languages
  supportedLngs: ["en", "es", "fr", "de", "ja", "zh", "pt-BR"],
  // Namespace configuration
  ns: ["translation"],
  defaultNS: "translation"
});
typeof window < "u" && (window.i18n = Jt);
const Z1 = (s, l, d, p, h) => {
  const f = Jt.t("welcomeMessage.apiAgentGreeting", { porg: s }), v = Jt.t("welcomeMessage.exploreCommands");
  return {
    event: {
      type: "agent-plan",
      agent_message: `${f}
${v}`,
      response_details: [
        {
          output: /* @__PURE__ */ _(Ht, { children: [
            Jt.t("welcomeMessage.limitations"),
            " ",
            vb(d, p, h)
          ] })
        }
      ],
      suggested_actions: [],
      first_message: !0,
      first_actions: [
        { icon: Yv, message: Jt.t("welcomeMessage.createApi") },
        { icon: Qv, message: Jt.t("welcomeMessage.publishApi") },
        { icon: ey, message: Jt.t("welcomeMessage.queryAnalytics") },
        { icon: ty, message: Jt.t("welcomeMessage.searchApis") }
      ],
      reasoning: null
      // Required by PlanEvent interface
    },
    timestamp: gn(),
    headers: l
  };
};
function Y1(s, l = "VITE_CUSTOM_HEADER_") {
  const d = {};
  return Object.keys(s).forEach((p) => {
    if (p.startsWith(l)) {
      const h = p.substring(l.length).replace(/_/g, "-").toLowerCase().split("-").map((v, w) => v === "ibm" ? v : w === 0 ? v.charAt(0).toUpperCase() + v.slice(1) : v).join("-"), f = s[p];
      f && typeof f == "string" && (d[h] = f);
    }
  }), d;
}
function Q1(s) {
  const l = {};
  return Object.entries(s).forEach(([d, p]) => {
    p && typeof p == "string" && p.trim() !== "" && (l[d] = p.trim());
  }), l;
}
function ew(...s) {
  return s.reduce((l, d) => d ? { ...l, ...d } : l, {});
}
const tw = (s) => /* @__PURE__ */ _(
  "svg",
  {
    id: "Layer_1",
    "data-name": "Layer 1",
    xmlns: "http://www.w3.org/2000/svg",
    width: "576",
    height: "576",
    viewBox: "0 0 576 576",
    ...s,
    children: [
      /* @__PURE__ */ o(
        "rect",
        {
          className: "cls-1",
          width: "576",
          height: "576"
        }
      ),
      /* @__PURE__ */ _("g", { children: [
        /* @__PURE__ */ o(
          "rect",
          {
            x: "128",
            y: "342.9495",
            width: "62.2222",
            height: "8.8889"
          }
        ),
        /* @__PURE__ */ o(
          "rect",
          {
            x: "128",
            y: "325.9797",
            width: "62.2222",
            height: "8.8889"
          }
        ),
        /* @__PURE__ */ o(
          "rect",
          {
            x: "145.7777",
            y: "309.01",
            width: "26.6667",
            height: "8.889"
          }
        ),
        /* @__PURE__ */ o(
          "rect",
          {
            x: "145.7777",
            y: "292.0404",
            width: "26.6667",
            height: "8.8889"
          }
        ),
        /* @__PURE__ */ o(
          "rect",
          {
            x: "145.7777",
            y: "275.0706",
            width: "26.6667",
            height: "8.8889"
          }
        ),
        /* @__PURE__ */ o(
          "rect",
          {
            x: "145.7777",
            y: "258.101",
            width: "26.6667",
            height: "8.8889"
          }
        ),
        /* @__PURE__ */ o(
          "rect",
          {
            x: "128",
            y: "241.1313",
            width: "62.2222",
            height: "8.8889"
          }
        ),
        /* @__PURE__ */ o(
          "rect",
          {
            x: "128",
            y: "224.1617",
            width: "62.2222",
            height: "8.8889"
          }
        ),
        /* @__PURE__ */ o("path", { d: "M199.1112,334.8686h94.842a33.7121,33.7121,0,0,0,3.576-8.8889h-98.418Z" }),
        /* @__PURE__ */ o("path", { d: "M286.5286,292.04h-69.64v8.8888h77.0547A34.0754,34.0754,0,0,0,286.5286,292.04Z" }),
        /* @__PURE__ */ o("path", { d: "M216.8889,275.0706V283.96h69.64a34.0774,34.0774,0,0,0,7.415-8.8889Z" }),
        /* @__PURE__ */ o("path", { d: "M293.9532,241.1313h-94.842V250.02h98.418A33.7148,33.7148,0,0,0,293.9532,241.1313Z" }),
        /* @__PURE__ */ o("path", { d: "M264.5656,224.1617H199.1112v8.8888h88.35A33.8138,33.8138,0,0,0,264.5656,224.1617Z" }),
        /* @__PURE__ */ o(
          "rect",
          {
            x: "216.8889",
            y: "258.101",
            width: "26.6667",
            height: "8.8889"
          }
        ),
        /* @__PURE__ */ o("path", { d: "M268.6061,266.99h28.71a33.9492,33.9492,0,0,0,1.189-8.8889h-29.899Z" }),
        /* @__PURE__ */ o(
          "rect",
          {
            x: "216.8889",
            y: "309.01",
            width: "26.6667",
            height: "8.889"
          }
        ),
        /* @__PURE__ */ o("path", { d: "M268.6061,309.01v8.889h29.899a33.9488,33.9488,0,0,0-1.189-8.889Z" }),
        /* @__PURE__ */ o("path", { d: "M199.1112,351.75l65.4544.0879a33.6926,33.6926,0,0,0,22.8959-8.8888h-88.35Z" }),
        /* @__PURE__ */ o("polygon", { points: "376.875 351.838 379.979 342.949 373.799 342.949 376.875 351.838" }),
        /* @__PURE__ */ o("polygon", { points: "370.962 334.869 382.816 334.869 385.936 325.98 367.842 325.98 370.962 334.869" }),
        /* @__PURE__ */ o("polygon", { points: "365.005 317.899 388.773 317.899 391.894 309.01 361.884 309.01 365.005 317.899" }),
        /* @__PURE__ */ o("polygon", { points: "359.047 300.929 394.731 300.929 397.851 292.04 355.927 292.04 359.047 300.929" }),
        /* @__PURE__ */ o("polygon", { points: "323.556 266.99 371.58 266.99 368.489 258.101 323.556 258.101 323.556 266.99" }),
        /* @__PURE__ */ o("polygon", { points: "388.099 250.02 448 250.02 448 241.131 391.19 241.131 388.099 250.02" }),
        /* @__PURE__ */ o("polygon", { points: "397.091 224.162 394 233.051 448 233.051 448 224.162 397.091 224.162" }),
        /* @__PURE__ */ o(
          "rect",
          {
            x: "305.7779",
            y: "342.9495",
            width: "44.4445",
            height: "8.8889"
          }
        ),
        /* @__PURE__ */ o(
          "rect",
          {
            x: "305.7779",
            y: "325.9797",
            width: "44.4445",
            height: "8.8889"
          }
        ),
        /* @__PURE__ */ o(
          "rect",
          {
            x: "323.5556",
            y: "309.01",
            width: "26.6667",
            height: "8.889"
          }
        ),
        /* @__PURE__ */ o(
          "rect",
          {
            x: "323.5556",
            y: "292.0404",
            width: "26.6667",
            height: "8.8889"
          }
        ),
        /* @__PURE__ */ o("polygon", { points: "430.222 258.101 385.289 258.101 382.198 266.99 430.222 266.99 430.222 258.101" }),
        /* @__PURE__ */ o("polygon", { points: "403.556 283.96 430.222 283.96 430.222 275.071 403.556 275.071 403.556 275.071 379.387 275.071 376.889 282.256 374.39 275.071 350.222 275.071 323.556 275.071 323.556 283.96 350.222 283.96 350.222 275.791 353.09 283.96 400.688 283.96 403.556 275.792 403.556 283.96" }),
        /* @__PURE__ */ o(
          "rect",
          {
            x: "403.5555",
            y: "292.0404",
            width: "26.6667",
            height: "8.8889"
          }
        ),
        /* @__PURE__ */ o(
          "rect",
          {
            x: "403.5555",
            y: "309.01",
            width: "26.6667",
            height: "8.889"
          }
        ),
        /* @__PURE__ */ o(
          "rect",
          {
            x: "403.5555",
            y: "325.9797",
            width: "44.4445",
            height: "8.8889"
          }
        ),
        /* @__PURE__ */ o(
          "rect",
          {
            x: "403.5555",
            y: "342.9495",
            width: "44.4445",
            height: "8.8889"
          }
        ),
        /* @__PURE__ */ o("polygon", { points: "365.679 250.02 362.588 241.131 305.778 241.131 305.778 250.02 365.679 250.02" }),
        /* @__PURE__ */ o("polygon", { points: "359.778 233.051 356.687 224.162 305.778 224.162 305.778 233.051 359.778 233.051" })
      ] }),
      /* @__PURE__ */ o("path", { fill: "white" })
    ]
  }
);
export {
  nb as AGENT_CONFIGURING_URL_AWS,
  rb as AGENT_CONFIGURING_URL_OPREM,
  $s as AGENT_GETTING_STARTED_URL_AWS,
  ha as AGENT_GETTING_STARTED_URL_OPREM,
  $1 as APIMDisconnectedEmptyState,
  H1 as APIProvider,
  Oy as ApiService,
  j1 as ApimEmptyState,
  pb as ApimInstanceSelector,
  mn as Block,
  T1 as ChatProvider,
  z1 as EditPlanPage,
  pc as ErrorNotification,
  W1 as ErrorProvider,
  ab as FETCH_ORGS_ERROR_MESSAGE,
  J1 as I18nDemo,
  tw as IBMLogo,
  ob as LANGUAGE_DISPLAY_NAMES,
  sb as LANGUAGE_LOCALE_MAP,
  K1 as LanguageSwitcher,
  D1 as LoadingMessage,
  p1 as McpAuthModal,
  M1 as Message,
  dc as PORG_ERROR_MESSAGE,
  G1 as PorgPicker,
  gb as PorgPickerInModal,
  X1 as PorgPickerModal,
  L1 as PromptInput,
  V1 as ReadOnlySettingsPage,
  F1 as RemoteDomRenderer,
  qs as SUPPORTED_LANGUAGES,
  U1 as SamplePromptsModal,
  Ey as SelectionTable,
  R1 as StreamingMessage,
  O1 as Toolbar,
  aw as Trans,
  B1 as UpdateHeadersModal,
  ya as apiFetch,
  b1 as cleanInput,
  Q1 as createProgrammaticHeaders,
  Z1 as createWelcomeMessage,
  lc as customHeadersToObject,
  y1 as decodeToken,
  N1 as del,
  q1 as documentationLink,
  S1 as findExecutedToolcall,
  I1 as findResponseDetail,
  k1 as formatLastInteractionDate,
  Ur as get,
  gn as getCurrentTime,
  zl as getCustomAgentType,
  js as getCustomHeaders,
  cc as getCustomHostUrl,
  v1 as getErrorMessage,
  f1 as getExpirationDate,
  Hl as getFileExtension,
  ny as getFileMetadata,
  rc as getFileName,
  Qs as getLearnMoreLink,
  py as getMissingRequiredFields,
  P1 as handleSlashCommand,
  iw as i18n,
  w1 as isAgentResponse,
  Rl as isElectron,
  g1 as isNestedObject,
  ew as mergeProgrammaticHeaders,
  sy as parseInputandValidate,
  Y1 as parseProgrammaticHeaders,
  nc as parseToolcallArguments,
  br as post,
  x1 as processFormattedSession,
  E1 as put,
  zy as saveCustomAgentType,
  Dy as saveCustomHeaders,
  Ry as saveCustomHostUrl,
  A1 as shouldResetToolcalls,
  _1 as shouldUpdatePlan,
  ay as tokenizeInput,
  m1 as transformChatMessagesData,
  C1 as updateContext,
  Ar as useAPI,
  mc as useError,
  va as useInput,
  dt as useMyContext,
  sw as useTranslation
};
//# sourceMappingURL=agent-ui-common.es.js.map
